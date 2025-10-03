import { icons, images } from '@/constants';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // Mock pro status (will be from database later)
  const [isPro, setIsPro] = React.useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/signin');
        },
      },
    ]);
  };

  const handleUpgradeToPro = () => {
    router.push('/pro-checkout');
  };

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="h1-bold text-dark-100">Profile</Text>
          </View>

          {/* Profile Card */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-md shadow-black/10">
            <View className="items-center mb-6">
              <View className="profile-avatar">
                <Image
                  source={images.avatar}
                  className="size-full rounded-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="h3-bold text-dark-100 mt-4">
                {user?.firstName || 'Kombucha'} {user?.lastName || 'Brewer'}
              </Text>
              <Text className="paragraph-medium text-gray-100 mt-1">
                {user?.primaryEmailAddress?.emailAddress}
              </Text>
              {isPro && (
                <View className="bg-primary px-4 py-1.5 rounded-full mt-3">
                  <Text className="small-bold text-white">⭐ PRO MEMBER</Text>
                </View>
              )}
            </View>

            {/* Profile Fields */}
            <View className="profile-field">
              <View className="profile-field__icon">
                <Image source={icons.envelope} className="size-6" />
              </View>
              <View className="flex-1">
                <Text className="body-medium text-gray-100">Email</Text>
                <Text className="paragraph-semibold text-dark-100">
                  {user?.primaryEmailAddress?.emailAddress}
                </Text>
              </View>
            </View>

            <View className="profile-field">
              <View className="profile-field__icon">
                <Image source={icons.person} className="size-6" />
              </View>
              <View className="flex-1">
                <Text className="body-medium text-gray-100">Name</Text>
                <Text className="paragraph-semibold text-dark-100">
                  {user?.firstName || 'Not set'} {user?.lastName || ''}
                </Text>
              </View>
            </View>

            <View className="profile-field mb-0">
              <View className="profile-field__icon">
                <Image source={icons.clock} className="size-6" />
              </View>
              <View className="flex-1">
                <Text className="body-medium text-gray-100">Member Since</Text>
                <Text className="paragraph-semibold text-dark-100">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                    'en-US',
                    { month: 'long', year: 'numeric' }
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Pro Section */}
          {!isPro ? (
            <TouchableOpacity
              onPress={handleUpgradeToPro}
              className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-6 mb-6 shadow-md shadow-black/10"
              activeOpacity={0.8}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="h3-bold text-white mb-2">
                    Upgrade to Booch Pro
                  </Text>
                  <Text className="body-regular text-white/90 mb-3">
                    Unlock unlimited batches, advanced analytics, and more!
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="paragraph-semibold text-white mr-2">
                      Learn More
                    </Text>
                    <Image
                      source={icons.arrowRight}
                      className="size-5"
                      tintColor="#fff"
                    />
                  </View>
                </View>
                <View className="ml-4">
                  <Text className="text-5xl">⭐</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View className="bg-success/10 rounded-2xl p-6 mb-6 border border-success">
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">✅</Text>
                <View className="flex-1">
                  <Text className="h3-bold text-success mb-1">
                    You're a Pro Member!
                  </Text>
                  <Text className="body-regular text-dark-100">
                    Enjoying unlimited batches and premium features
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center bg-white rounded-2xl p-4 shadow-md shadow-black/10"
            activeOpacity={0.7}>
            <Image source={icons.logout} className="size-6 mr-3" />
            <Text className="paragraph-semibold text-error">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
