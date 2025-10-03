import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { images } from '@/constants';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
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

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        Alert.alert('Error', 'Sign in failed. Please try again.');
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert('Error', err.errors?.[0]?.message || 'Sign in failed');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const { createdSessionId, setActive: setActiveSession } =
        await startOAuthFlow();

      if (createdSessionId) {
        await setActiveSession!({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert('Error', 'Google sign in failed. Please try again.');
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
            <Text className="h1-bold text-dark-100 mt-2">Welcome to Booch</Text>
            <Text className="paragraph-medium text-gray-100 text-center mt-1">
              Track your kombucha fermentations
            </Text>
          </View>

          {/* Login Graphic */}
          <View className="items-center mb-4">
            <Image
              source={images.loginGraphic}
              className="w-full h-32"
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="mb-4">
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
              handleChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry
            />
          </View>

          {/* Sign In Button */}
          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            isLoading={isLoading}
            containerStyles="mb-4"
          />

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="paragraph-medium text-gray-100 px-4">OR</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Google Sign In Button */}
          <TouchableOpacity
            onPress={onGoogleSignIn}
            disabled={isLoading}
            className={`flex-row items-center justify-center bg-white border border-gray-300 rounded-full p-3 mb-4 ${isLoading ? 'opacity-50' : ''}`}
            activeOpacity={0.7}>
            <Text className="text-4xl mr-3">🔍</Text>
            <Text className="paragraph-semibold text-dark-100">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-2">
            <Text className="paragraph-medium text-gray-100">
              Dont have an account?{' '}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="paragraph-semibold text-primary">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
