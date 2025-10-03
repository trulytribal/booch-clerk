import BatchCard from '@/components/BatchCard';
import { images } from '@/constants';
import { Batch } from '@/types';
import { useUser } from '@clerk/clerk-expo';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for now (will be replaced with API call later)
const mockBatches: Batch[] = [
  {
    id: 1,
    user_id: 1,
    name: 'Ginger Turmeric',
    start_date_f1: '2025-09-15',
    tea_type: 'Green Tea',
    sugar_grams: 200,
    status: 'F2',
    created_at: '2025-09-15T10:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    name: 'Strawberry Basil',
    start_date_f1: '2025-09-20',
    tea_type: 'Black Tea',
    sugar_grams: 180,
    status: 'F1',
    created_at: '2025-09-20T10:00:00Z',
  },
  {
    id: 3,
    user_id: 1,
    name: 'Blueberry Lavender',
    start_date_f1: '2025-08-01',
    end_date_f1: '2025-08-08',
    tea_type: 'Green Tea',
    sugar_grams: 200,
    status: 'Completed',
    created_at: '2025-08-01T10:00:00Z',
  },
];

const Home = () => {
  const { user } = useUser();
  const [batches, setBatches] = React.useState<Batch[]>(mockBatches);
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch batches from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 mt-20">
      <Image
        source={images.emptyState}
        className="w-64 h-64 mb-6"
        resizeMode="contain"
      />
      <Text className="h3-bold text-dark-100 text-center mb-2">
        No Batches Yet
      </Text>
      <Text className="paragraph-medium text-gray-100 text-center">
        Start your first kombucha fermentation by tapping the "New Batch" tab
        below
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-6 bg-white border-b border-gray-200">
          <Text className="h1-bold text-dark-100">My Batches</Text>
          <Text className="paragraph-medium text-gray-100 mt-1">
            Welcome back, {user?.firstName || 'Brewer'}! 🍵
          </Text>
        </View>

        {/* Batches List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FE8C00" />
          </View>
        ) : (
          <FlatList
            data={batches}
            renderItem={({ item }) => <BatchCard batch={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 24,
            }}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FE8C00"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
