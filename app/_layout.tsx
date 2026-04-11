import { Stack } from "expo-router";
import { FuelProvider } from "../context/FuelContext";

export default function RootLayout() {
  return (
    <FuelProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerTitle: "Dodaj tankowanie",
          }}
        />
      </Stack>
    </FuelProvider>
  );
}
