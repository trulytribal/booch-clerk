import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewBatch = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    teaType: '',
    sugarGrams: '',
    startDate: new Date().toISOString().split('T')[0], // Today's date
  });

  const handleCreateBatch = async () => {
    if (!form.name || !form.teaType || !form.sugarGrams) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call API to create batch
      Alert.alert(
        'Success',
        'Batch created successfully! Database integration coming soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setForm({
                name: '',
                teaType: '',
                sugarGrams: '',
                startDate: new Date().toISOString().split('T')[0],
              });
              router.push('/(tabs)/home');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create batch. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="flex-grow">
          <View className="flex-1 px-6 py-6">
            {/* Header */}
            <View className="mb-8">
              <Text className="h1-bold text-dark-100">
                Start New Fermentation
              </Text>
              <Text className="paragraph-medium text-gray-100 mt-2">
                Begin tracking your kombucha batch
              </Text>
            </View>

            {/* Form */}
            <View className="mb-6">
              <InputField
                title="Batch Name *"
                value={form.name}
                placeholder="e.g., Ginger Turmeric Booch"
                handleChangeText={(text) => setForm({ ...form, name: text })}
              />

              <InputField
                title="Tea Type *"
                value={form.teaType}
                placeholder="e.g., Black Tea, Green Tea"
                handleChangeText={(text) => setForm({ ...form, teaType: text })}
              />

              <InputField
                title="Sugar Amount (grams) *"
                value={form.sugarGrams}
                placeholder="e.g., 200"
                handleChangeText={(text) =>
                  setForm({ ...form, sugarGrams: text })
                }
                keyboardType="numeric"
              />

              <InputField
                title="Start Date"
                value={form.startDate}
                placeholder="YYYY-MM-DD"
                handleChangeText={(text) =>
                  setForm({ ...form, startDate: text })
                }
              />
            </View>

            {/* Info Box */}
            <View className="bg-primary/10 rounded-xl p-4 mb-6">
              <Text className="paragraph-semibold text-dark-100 mb-2">
                📝 First Fermentation Tips:
              </Text>
              <Text className="body-regular text-dark-100">
                • Typical F1 takes 7-14 days{'\n'}• Keep in a warm, dark place
                {'\n'}• Taste test after day 7{'\n'}• When it's tangy enough,
                start F2!
              </Text>
            </View>

            {/* Create Button */}
            <CustomButton
              title="Start Fermentation"
              onPress={handleCreateBatch}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewBatch;
