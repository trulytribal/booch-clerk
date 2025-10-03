import { icons } from '@/constants';
import { Batch } from '@/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface BatchCardProps {
  batch: Batch;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'F1':
      return 'bg-blue-100 border-blue-500';
    case 'F2':
      return 'bg-orange-100 border-orange-500';
    case 'Completed':
      return 'bg-green-100 border-green-500';
    default:
      return 'bg-gray-100 border-gray-500';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'F1':
      return 'text-blue-700';
    case 'F2':
      return 'text-orange-700';
    case 'Completed':
      return 'text-green-700';
    default:
      return 'text-gray-700';
  }
};

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/batch/${batch.id}`)}
      className="bg-white rounded-2xl p-4 mb-4 shadow-md shadow-black/10"
      activeOpacity={0.7}>
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="h3-bold text-dark-100 mb-1">{batch.name}</Text>
          {batch.tea_type && (
            <Text className="body-medium text-gray-100">{batch.tea_type}</Text>
          )}
        </View>
        <View
          className={`px-3 py-1.5 rounded-full border ${getStatusColor(batch.status)}`}>
          <Text className={`small-bold ${getStatusTextColor(batch.status)}`}>
            {batch.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center">
        <View className="flex-row items-center flex-1">
          <Image
            source={icons.clock}
            className="size-4 mr-2"
            tintColor="#878787"
          />
          <Text className="body-regular text-gray-100">
            Started: {formatDate(batch.start_date_f1)}
          </Text>
        </View>
        <Image
          source={icons.arrowRight}
          className="size-5"
          tintColor="#FE8C00"
        />
      </View>

      {batch.sugar_grams && (
        <View className="flex-row items-center mt-2">
          <Image
            source={icons.star}
            className="size-4 mr-2"
            tintColor="#878787"
          />
          <Text className="body-regular text-gray-100">
            {batch.sugar_grams}g sugar
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BatchCard;
