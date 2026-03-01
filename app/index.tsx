import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Colors } from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Background,
    padding: 20,
  },
  logo: {
    fontSize: 70,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonText: {
    color: Colors.white,
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
      <Link href="/(tabs)" style={styles.button} asChild>
      <Text style={styles.buttonText}>Zacznij</Text>
      </Link>
    </View>
  );
}