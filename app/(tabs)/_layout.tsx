import { icons } from '@/constants';
import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

const TabIcon = ({
  source,
  focused,
  label,
}: {
  source: ImageSourcePropType;
  focused: boolean;
  label: string;
}) => (
  <View className="tab-icon">
    <View
      className={`flex-center size-12 rounded-full ${
        focused ? 'bg-primary' : 'bg-transparent'
      }`}>
      <Image
        source={source}
        className="size-6"
        resizeMode="contain"
        tintColor={focused ? '#fff' : '#878787'}
      />
    </View>
    <Text
      className={`text-xs mt-1 ${
        focused
          ? 'font-quicksand-semibold text-primary'
          : 'font-quicksand text-gray-100'
      }`}>
      {label}
    </Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 84,
          paddingBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="new-batch"
        options={{
          title: 'New Batch',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.plus} focused={focused} label="New Batch" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.person} focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
