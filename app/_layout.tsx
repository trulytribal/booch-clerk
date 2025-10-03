import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import './globals.css';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Quicksand-Bold': require('@/assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Light': require('@/assets/fonts/Quicksand-Light.ttf'),
    'Quicksand-Regular': require('@/assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('@/assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('@/assets/fonts/Quicksand-SemiBold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="batch/[id]" />
          <Stack.Screen name="pro-checkout" />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
