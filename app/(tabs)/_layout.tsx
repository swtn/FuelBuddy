import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "FuelBuddy",
        headerTitleStyle: {
          fontWeight: "900",
          color: "#2563eb",
          letterSpacing: 1,
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#f8f9fe",
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dziennik",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{ 
          title: 'Statystyki', 
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="service"
        options={{ 
          title: 'Serwisowanie', 
          tabBarIcon: ({ color }) => <Ionicons name="construct-outline" size={24} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
