import { View, Text, StyleSheet } from "react-native";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa</Text>
      <Text style={styles.subtitle}>Tutaj będzie mapa z lokalizacją stacji benzynowych</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#fff',
    padding: 20,
  },
    title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#333',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: "center",
    marginBottom: 20,
  },
})
