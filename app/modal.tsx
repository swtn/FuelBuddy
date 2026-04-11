import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFuel } from "../context/FuelContext";

export default function ModalScreen() {
  const router = useRouter();
  const { addEntry } = useFuel();

  const [station, setStation] = useState("");
  const [liters, setLiters] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [odometer, setOdometer] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Błąd", "Aplikacja potrzebuje uprawnień do aparatu");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const l = parseFloat(liters);
    const c = parseFloat(pricePerLiter);
    const o = parseFloat(odometer);

    if (!station || isNaN(l) || isNaN(c) || isNaN(o)) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie pola poprawnie");
      return;
    }

    addEntry({
      id: Date.now().toString(),
      station,
      liters: l,
      pricePerLiter: c,
      totalCost: l * c,
      odometer: o,
      date: new Date().toISOString(),
      imageUri: image || undefined,
    });

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Stacja paliw</Text>
      <TextInput
        style={styles.input}
        placeholder="np. Orlen, Shell"
        value={station}
        onChangeText={setStation}
      />

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.label}>Litry (l)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={liters}
            onChangeText={setLiters}
          />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.label}>Cena za litr (PLN)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={pricePerLiter}
            onChangeText={setPricePerLiter}
          />
        </View>
      </View>

      <Text style={styles.label}>Aktualny przebieg (km)</Text>
      <TextInput
        style={styles.input}
        placeholder="np. 125400"
        keyboardType="number-pad"
        value={odometer}
        onChangeText={setOdometer}
      />

      <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
        <Ionicons name="camera" size={24} color="#2563eb" />
        <Text style={styles.photoButtonText}>
          {image ? "Zmień zdjęcie paragonu" : "Dodaj zdjęcie paragonu"}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Zapisz tankowanie</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#f8f9fe",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  row: { flexDirection: "row", gap: 12 },
  flex1: { flex: 1 },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#2563eb",
    borderStyle: "dashed",
    borderRadius: 12,
    marginTop: 24,
    backgroundColor: "#eff6ff",
  },
  photoButtonText: { marginLeft: 8, color: "#2563eb", fontWeight: "600" },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 16,
    resizeMode: "cover",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
