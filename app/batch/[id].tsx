import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { icons } from '@/constants';
import { Batch, Bottle } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

// Mock data - will be fetched from API later
const mockBatch: Batch = {
  id: 1,
  user_id: 1,
  name: 'Ginger Turmeric',
  start_date_f1: '2025-09-15',
  tea_type: 'Green Tea',
  sugar_grams: 200,
  status: 'F2',
  end_date_f1: '2025-09-22',
  created_at: '2025-09-15T10:00:00Z',
};

const mockBottles: Bottle[] = [
  {
    id: 1,
    batch_id: 1,
    bottling_date: '2025-09-22',
    flavor_ingredients: 'Fresh ginger, turmeric powder',
    status: 'F2',
    created_at: '2025-09-22T10:00:00Z',
  },
];

const BatchDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [batch, setBatch] = useState<Batch>(mockBatch);
  const [bottles, setBottles] = useState<Bottle[]>(mockBottles);
  const [isLoading, setIsLoading] = useState(false);

  const [showAddBottle, setShowAddBottle] = useState(false);
  const [bottleForm, setBottleForm] = useState({
    flavorIngredients: '',
    bottlingDate: new Date().toISOString().split('T')[0],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleStartF2 = async () => {
    Alert.alert(
      'Start Second Fermentation',
      'Are you ready to bottle your kombucha?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Start F2',
          onPress: async () => {
            setIsLoading(true);
            try {
              // TODO: Call API to update batch status
              setBatch({
                ...batch,
                status: 'F2',
                end_date_f1: new Date().toISOString().split('T')[0],
              });
              Alert.alert('Success', 'Second fermentation started!');
            } catch (error) {
              Alert.alert('Error', 'Failed to start F2. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAddBottle = async () => {
    if (!bottleForm.flavorIngredients) {
      Alert.alert('Error', 'Please enter flavor ingredients');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to create bottle
      const newBottle: Bottle = {
        id: bottles.length + 1,
        batch_id: batch.id,
        bottling_date: bottleForm.bottlingDate,
        flavor_ingredients: bottleForm.flavorIngredients,
        status: 'F2',
        created_at: new Date().toISOString(),
      };
      setBottles([...bottles, newBottle]);
      setBottleForm({
        flavorIngredients: '',
        bottlingDate: new Date().toISOString().split('T')[0],
      });
      setShowAddBottle(false);
      Alert.alert('Success', 'Bottle added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add bottle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-gray-200 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2"
            activeOpacity={0.7}>
            <Image source={icons.arrowBack} className="size-6" />
          </TouchableOpacity>
          <Text className="h3-bold text-dark-100 flex-1">Batch Details</Text>
        </View>

        <View className="px-6 py-6">
          {/* Batch Info Card */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-md shadow-black/10">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="h1-bold text-dark-100 mb-2">{batch.name}</Text>
                <View className="flex-row items-center mb-1">
                  <Image
                    source={icons.clock}
                    className="size-4 mr-2"
                    tintColor="#878787"
                  />
                  <Text className="body-regular text-gray-100">
                    Started: {formatDate(batch.start_date_f1)}
                  </Text>
                </View>
                {batch.end_date_f1 && (
                  <View className="flex-row items-center">
                    <Image
                      source={icons.check}
                      className="size-4 mr-2"
                      tintColor="#878787"
                    />
                    <Text className="body-regular text-gray-100">
                      F1 Ended: {formatDate(batch.end_date_f1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="border-t border-gray-200 pt-4">
              <View className="flex-row justify-between mb-2">
                <Text className="paragraph-medium text-gray-100">Tea Type</Text>
                <Text className="paragraph-semibold text-dark-100">
                  {batch.tea_type || 'Not specified'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="paragraph-medium text-gray-100">
                  Sugar Amount
                </Text>
                <Text className="paragraph-semibold text-dark-100">
                  {batch.sugar_grams
                    ? `${batch.sugar_grams}g`
                    : 'Not specified'}
                </Text>
              </View>
            </View>
          </View>

          {/* F1 -> F2 Transition */}
          {batch.status === 'F1' && (
            <View className="mb-6">
              <View className="bg-blue-50 rounded-2xl p-6 mb-4 border border-blue-200">
                <Text className="h3-bold text-blue-900 mb-2">
                  First Fermentation
                </Text>
                <Text className="body-regular text-blue-800">
                  Your kombucha is currently in first fermentation. Once it
                  reaches your desired tanginess, start the second fermentation
                  to carbonate and add flavors!
                </Text>
              </View>
              <CustomButton
                title="Start Second Fermentation"
                onPress={handleStartF2}
                isLoading={isLoading}
              />
            </View>
          )}

          {/* F2 Bottles Section */}
          {(batch.status === 'F2' || batch.status === 'Completed') && (
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="h3-bold text-dark-100">Bottles</Text>
                <TouchableOpacity
                  onPress={() => setShowAddBottle(!showAddBottle)}
                  className="flex-row items-center bg-primary px-4 py-2 rounded-full"
                  activeOpacity={0.7}>
                  <Image
                    source={showAddBottle ? icons.minus : icons.plus}
                    className="size-4 mr-2"
                    tintColor="#fff"
                  />
                  <Text className="paragraph-semibold text-white">
                    {showAddBottle ? 'Cancel' : 'Add Bottle'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Add Bottle Form */}
              {showAddBottle && (
                <View className="bg-white rounded-2xl p-4 mb-4 shadow-md shadow-black/10">
                  <Text className="paragraph-semibold text-dark-100 mb-4">
                    New Bottle
                  </Text>
                  <InputField
                    title="Flavor Ingredients"
                    value={bottleForm.flavorIngredients}
                    placeholder="e.g., Fresh ginger, turmeric powder"
                    handleChangeText={(text) =>
                      setBottleForm({
                        ...bottleForm,
                        flavorIngredients: text,
                      })
                    }
                  />
                  <InputField
                    title="Bottling Date"
                    value={bottleForm.bottlingDate}
                    placeholder="YYYY-MM-DD"
                    handleChangeText={(text) =>
                      setBottleForm({ ...bottleForm, bottlingDate: text })
                    }
                  />
                  <CustomButton
                    title="Add Bottle"
                    onPress={handleAddBottle}
                    isLoading={isLoading}
                  />
                </View>
              )}

              {/* Bottles List */}
              {bottles.map((bottle) => (
                <View
                  key={bottle.id}
                  className="bg-white rounded-2xl p-4 mb-4 shadow-md shadow-black/10">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="paragraph-semibold text-dark-100 mb-1">
                        Bottle #{bottle.id}
                      </Text>
                      <Text className="body-regular text-gray-100">
                        {bottle.flavor_ingredients}
                      </Text>
                    </View>
                    <View className="bg-orange-100 px-3 py-1 rounded-full">
                      <Text className="small-bold text-orange-700">
                        {bottle.status}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <Image
                      source={icons.clock}
                      className="size-4 mr-2"
                      tintColor="#878787"
                    />
                    <Text className="body-regular text-gray-100">
                      Bottled: {formatDate(bottle.bottling_date)}
                    </Text>
                  </View>
                  <CustomButton
                    title="Log Tasting Notes"
                    onPress={() =>
                      Alert.alert(
                        'Coming Soon',
                        'Tasting notes feature will be added with database integration!'
                      )
                    }
                    containerStyles="mt-2"
                  />
                </View>
              ))}

              {bottles.length === 0 && (
                <View className="bg-gray-100 rounded-2xl p-6 items-center">
                  <Text className="paragraph-medium text-gray-100 text-center">
                    No bottles added yet. Add your first bottle to start
                    tracking F2!
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BatchDetail;
