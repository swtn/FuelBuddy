import { useFuel } from "@/context/FuelContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsScreen() {
  const { state, updateVehicleInfo } = useFuel();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [nextService, setNextService] = useState(
    state.vehicleInfo.nextServiceKm.toString(),
  );
  const [lastOil, setLastOil] = useState(
    state.vehicleInfo.lastOilChangeKm.toString(),
  );
  const [techReview, setTechReview] = useState(
    state.vehicleInfo.techReviewDate,
  );

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    setNextService(state.vehicleInfo.nextServiceKm.toString());
    setLastOil(state.vehicleInfo.lastOilChangeKm.toString());
    setTechReview(state.vehicleInfo.techReviewDate);
  }, [state.vehicleInfo]);

  const handleSaveSettings = async () => {
    try {
      await updateVehicleInfo({
        nextServiceKm: parseInt(nextService) || 0,
        lastOilChangeKm: parseInt(lastOil) || 0,
        techReviewDate: techReview,
      });
      Alert.alert("Sukces", "Ustawienia zostały zapisane pomyślnie!");
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się zapisać ustawień.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Wylogowanie", "Czy na pewno chcesz się wylogować?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Wyloguj",
        style: "destructive",
        onPress: async () => {
          try {
            await supabase.auth.signOut();
          } catch (error) {
            Alert.alert("Błąd", "Nie udało się wylogować. Spróbuj ponownie");
          }
        },
      },
    ]);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Ustawienia</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Konto użytkownika</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#2563eb" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.emailLabel}>Zalogowany jako:</Text>
            <Text style={styles.emailText}>{userEmail ?? "Pobieranie..."}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ustawienia pojazdu</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Następny serwis (km)</Text>
          <TextInput
            style={styles.input}
            value={nextService}
            onChangeText={setNextService}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ostatnia wymiana oleju (km)</Text>
          <TextInput
            style={styles.input}
            value={lastOil}
            onChangeText={setLastOil}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data przeglądu technicznego</Text>
          <TextInput
            style={styles.input}
            value={techReview}
            onChangeText={setTechReview}
            placeholder="RRRR-MM-DD"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveSettings}
        >
          <Ionicons
            name="save-outline"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.saveButtonText}>Zapisz ustawienia</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#ef4444"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutButtonText}>Wyloguj się</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fe",
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 25,
    marginTop: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: 15,
  },
  emailLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f8f9fe",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutSection: {
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#fecaca",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
