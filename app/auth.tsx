import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola!");
      return;
    }

    setLoading(true);

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) Alert.alert("Błąd rejestracji", error.message);
      else Alert.alert("Sukces", "Konto zostalo utworzone");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) Alert.alert("Błąd logowania", error.message);
      else {
        router.replace("/(tabs)");
      }
    }
    setLoading(false);
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Ionicons name="water" size={80} color="#2563eb" />
            <Text style={styles.title}>FuelBuddy</Text>
            <Text style={styles.subtitle}>Twoje paliwo pod kontrolą</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.tabTitle}>
              {isRegistering ? "Tworzenie konta" : "Logowanie"}
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Email"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Hasło"
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isRegistering ? "Zarejestruj się" : "Zaloguj się"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsRegistering(!isRegistering)}
            >
              <Text style={styles.switchText}>
                {isRegistering
                  ? "Masz już konto? Zaloguj się"
                  : "Nie masz konta? Zarejestruj się"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1e293b", marginTop: 10 },
  subtitle: { fontSize: 16, color: "#64748b" },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: "#1e293b" },
  button: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#93c5fd" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  switchButton: { marginTop: 20, alignItems: "center" },
  switchText: { color: "#2563eb", fontSize: 14, fontWeight: "500" },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  eyeButton: {
    padding: 4,
  },
});
