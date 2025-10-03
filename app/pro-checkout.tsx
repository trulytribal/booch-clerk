import CustomButton from '@/components/CustomButton';
import { icons } from '@/constants';
import { useRouter } from 'expo-router';
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

const ProCheckout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: icons.check,
      title: 'Unlimited Batches',
      description: 'Track as many fermentations as you want',
    },
    {
      icon: icons.star,
      title: 'Advanced Analytics',
      description: 'Detailed insights into your brewing patterns',
    },
    {
      icon: icons.clock,
      title: 'Fermentation Reminders',
      description: 'Never forget to check your booch',
    },
    {
      icon: icons.pencil,
      title: 'Custom Notes',
      description: 'Add unlimited notes and photos',
    },
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      // TODO: Implement Stripe payment
      Alert.alert(
        'Payment Integration',
        'Stripe payment will be integrated in the next phase!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-gray-200 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2"
            activeOpacity={0.7}>
            <Image source={icons.arrowBack} className="size-6" />
          </TouchableOpacity>
          <Text className="h3-bold text-dark-100 flex-1">Booch Pro</Text>
        </View>

        <View className="px-6 py-8">
          {/* Hero Section */}
          <View className="items-center mb-8">
            <View className="bg-primary/10 rounded-full p-6 mb-4">
              <Text className="text-6xl">⭐</Text>
            </View>
            <Text className="h1-bold text-dark-100 text-center mb-2">
              Upgrade to Pro
            </Text>
            <Text className="paragraph-medium text-gray-100 text-center">
              Take your kombucha brewing to the next level
            </Text>
          </View>

          {/* Pricing Card */}
          <View className="bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-8 mb-8 shadow-lg shadow-black/20">
            <View className="items-center mb-6">
              <Text className="text-5xl font-quicksand-bold text-white mb-2">
                $9.99
              </Text>
              <Text className="paragraph-medium text-white/90">per month</Text>
            </View>
            <View className="bg-white/20 rounded-2xl p-4">
              <Text className="paragraph-semibold text-white text-center">
                🎉 First month 50% off!
              </Text>
            </View>
          </View>

          {/* Features List */}
          <View className="mb-8">
            <Text className="h3-bold text-dark-100 mb-4">Whats Included:</Text>
            {features.map((feature, index) => (
              <View
                key={index}
                className="flex-row items-start mb-4 bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
                <View className="bg-primary/10 rounded-full p-2 mr-4">
                  <Image source={feature.icon} className="size-6" />
                </View>
                <View className="flex-1">
                  <Text className="paragraph-semibold text-dark-100 mb-1">
                    {feature.title}
                  </Text>
                  <Text className="body-regular text-gray-100">
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Subscribe Button */}
          <CustomButton
            title="Subscribe Now"
            onPress={handleSubscribe}
            isLoading={isLoading}
            containerStyles="mb-4"
          />

          {/* Terms */}
          <Text className="body-regular text-gray-100 text-center">
            Cancel anytime. Terms and conditions apply.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProCheckout;
