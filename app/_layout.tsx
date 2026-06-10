// Powered by OnSpace.AI
import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { AppProvider } from '@/contexts/AppContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="ride-booking" options={{ presentation: 'modal' }} />
            <Stack.Screen name="ride-tracking" />
            <Stack.Screen name="ride-rating" />
            <Stack.Screen name="family-member" />
            <Stack.Screen name="add-family-member" options={{ presentation: 'modal' }} />
            <Stack.Screen name="chat" />
            <Stack.Screen name="post-detail" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="admin-panel" />
            <Stack.Screen name="wallet-topup" options={{ presentation: 'modal' }} />
            <Stack.Screen name="withdrawal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="referral-levels" />
            <Stack.Screen name="stories" />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
