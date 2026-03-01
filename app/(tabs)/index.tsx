import { StyleSheet, Text, View, Image } from "react-native";
import { Link } from "expo-router";

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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default function HomeScreen() {
  return (
    //TUTAJ DODAC OBRAZEK PASUJACY DO STACJI BENZYNOWEj
    <View style={styles.container}>
      <Text style={styles.title}>FuelBuddy</Text>
      <Text style={styles.subtitle}>Twój dziennik kosztow paliwa i tras</Text>
      <Link href="/(tabs)" style={styles.buttonText}>
      <Text style={styles.buttonText}>Zacznij</Text>
      </Link>
    </View>
  );
}