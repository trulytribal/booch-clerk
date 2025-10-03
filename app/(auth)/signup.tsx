import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { images } from '@/constants';
import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

const SignUp = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    email: '',
    password: '',
  });
  const [verification, setVerification] = useState({
    state: 'default',
    code: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!form.firstName || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await signUp.create({
        firstName: form.firstName,
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setVerification({ ...verification, state: 'pending' });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert('Error', err.errors?.[0]?.message || 'Sign up failed');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!verification.code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === 'complete') {
        // TODO: Later, sync user to database here
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        Alert.alert('Error', 'Verification failed. Please try again.');
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    setIsLoading(true);

    try {
      const { createdSessionId, setActive: setActiveSession } =
        await startOAuthFlow();

      if (createdSessionId) {
        // TODO: Later, sync user to database here
        await setActiveSession!({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert('Error', 'Google sign up failed. Please try again.');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="flex-grow">
        <View className="flex-1 px-6 py-6">
          {/* Logo */}
          <View className="items-center mb-6">
            <Image
              source={images.logo}
              className="w-24 h-24"
              resizeMode="contain"
            />
            <Text className="h1-bold text-dark-100 mt-2">Create Account</Text>
            <Text className="paragraph-medium text-gray-100 text-center mt-1">
              Start tracking your kombucha batches
            </Text>
          </View>

          {verification.state === 'pending' ? (
            <>
              {/* Verification View */}
              <View className="items-center mb-6">
                <Image
                  source={images.success}
                  className="w-24 h-24"
                  resizeMode="contain"
                />
                <Text className="h3-bold text-dark-100 mt-3 text-center">
                  Verify Your Email
                </Text>
                <Text className="paragraph-medium text-gray-100 text-center mt-1">
                  We've sent a verification code to {form.email}
                </Text>
              </View>

              <InputField
                title="Verification Code"
                value={verification.code}
                placeholder="Enter 6-digit code"
                handleChangeText={(text) =>
                  setVerification({ ...verification, code: text })
                }
                keyboardType="number-pad"
              />

              <CustomButton
                title="Verify Email"
                onPress={onVerifyPress}
                isLoading={isLoading}
              />
            </>
          ) : (
            <>
              {/* Sign Up Form */}
              <View className="mb-4">
                <InputField
                  title="First Name"
                  value={form.firstName}
                  placeholder="Enter your first name"
                  handleChangeText={(text) =>
                    setForm({ ...form, firstName: text })
                  }
                />

                <InputField
                  title="Email"
                  value={form.email}
                  placeholder="Enter your email"
                  handleChangeText={(text) => setForm({ ...form, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <InputField
                  title="Password"
                  value={form.password}
                  placeholder="Enter your password"
                  handleChangeText={(text) =>
                    setForm({ ...form, password: text })
                  }
                  secureTextEntry
                />
              </View>

              <CustomButton
                title="Sign Up"
                onPress={onSignUpPress}
                isLoading={isLoading}
                containerStyles="mb-4"
              />

              {/* Divider */}
              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="paragraph-medium text-gray-100 px-4">OR</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Google Sign Up Button */}
              <TouchableOpacity
                onPress={onGoogleSignUp}
                disabled={isLoading}
                className={`flex-row items-center justify-center bg-white border border-gray-300 rounded-full p-3 mb-4 ${isLoading ? 'opacity-50' : ''}`}
                activeOpacity={0.7}>
                <Text className="text-4xl mr-3">🔍</Text>
                <Text className="paragraph-semibold text-dark-100">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View className="flex-row justify-center mt-2">
                <Text className="paragraph-medium text-gray-100">
                  Already have an account?{' '}
                </Text>
                <Link href="/(auth)/signin" asChild>
                  <TouchableOpacity>
                    <Text className="paragraph-semibold text-primary">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
