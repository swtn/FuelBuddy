import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingScreen() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    }
  }, []);

  const handleLogout = () => {
    Alert.alert("Wylogowywane", "Czy na pewno chcesz się wylogować", [
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

  const handleAboutApp = () => {
    Alert.alert(
      "O aplikacji",
      "FuelBuddy V1.0.0\n\nTwoja osobista aplikacja do zarządzania wydatkami na paliwo.\n\nStworzono w ramach projektu zaliczeniowego",
      [{ text: "Zamknij" }],
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Polityka Prywatności",
      "Twoje dane logowania oraz wszystkie wpisy dotyczące kosztów tankowania są bezpiecznie szyfrowane i przechowywane w dedykowanej bazie danych Supabase. Aplikacja nie udostępnia Twoich danych podmiotom trzecim.",
      [{ text: "Akceptuję" }],
    );
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
        <Text style={styles.sectionTitle}>Informacje i pomoc</Text>

        <TouchableOpacity style={styles.settingRow} onPress={handleAboutApp}>
          <View style={styles.settingRowLeft}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#475569"
            />
            <Text style={styles.settingRowText}>O Aplikacji</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={handlePrivacyPolicy}
        >
          <View style={styles.settingRowLeft}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#475569"
            />
            <Text style={styles.settingRowText}>Polityka prywatności</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <View
          style={[
            styles.settingRow,
            { borderBottomWidth: 0, paddingBottom: 4 },
          ]}
        >
          <View style={styles.settingRowLeft}>
            <Ionicons name="git-branch-outline" size={22} color="#475569" />
            <Text style={styles.settingRowText}>Wersja aplikacji</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingRowText: {
    fontSize: 16,
    color: "#1e293b",
    marginLeft: 12,
    fontWeight: "500",
  },
  versionText: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
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
