import { Stack } from 'expo-router';
import { FuelProvider } from '../context/FuelContext';

export const unstable_settings = {
  
};

export default function RootLayout() {
  return (
      <FuelProvider>
      <Stack initialRouteName='index'>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      </FuelProvider>
  );
}
