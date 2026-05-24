import { FuelProvider } from "@/context/FuelContext";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const isPublicRoute = segments[0] === "auth";

    if (session && isPublicRoute) {
      router.replace("/(tabs)");
    } else if (!session && !isPublicRoute) {
      router.replace("/auth");
    }
  }, [session, initialized, segments]);

  return (
    <FuelProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Dodaj wpis",
          }}
        />
      </Stack>
    </FuelProvider>
  );
}
