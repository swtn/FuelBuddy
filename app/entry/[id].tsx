import { useFuel } from "@/context/FuelContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EntryDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { state, deleteEntry } = useFuel();
    const router = useRouter();

    const entry = state.entries.find((e) => e.id === id);

    if (!entry) {
        return (
            <View style={styles.center}>
                <Text>Nie znaleziono wpisu</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert("Usuń wpis", "Czy napewno chcesz usunąć to tankowanie?", [
            { text: "Anuluj", style: "cancel"},
            {
                text: "Usuń",
                style: "destructive",
                onPress: () => {
                    deleteEntry(entry.id);
                    router.back();
                },
            },
        ]);
    };

    const formattedDate = entry 
        ? new Date(entry.date).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        : "";

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: entry ? `Tankowanie: ${formattedDate}` : "Szczegóły",
                    headerTintColor: "#25663",
                    headerTitleStyle: { fontWeight: 'bold' }
                }}
                />

        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.stationName}>{entry.station}</Text>
                <Text style={styles.date}>{new Date(entry.date).toLocaleDateString("pl-PL")}</Text>
            </View>

            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Koszt całkowity</Text>
                <Text style={styles.statValue}>{(Number(entry.totalCost) || 0).toFixed(2)} PLN</Text>
            </View>

            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Cena za ltir</Text>
                <Text style={styles.statValue}>{entry.pricePerLiter.toFixed(2)} PLN</Text>
            </View>

            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Przebieg</Text>
                <Text style={styles.statValue}>{entry.odometer} KM</Text>
            </View>

            {entry.imageUri ? (
                <View style={styles.imageContainer}>
                    <Text style={styles.label}>Zdjęcie paragonu:</Text>
                    <Image source={{ uri: entry.imageUri }} style={styles.image} />
                    </View>
                ) : (
                    <View style={styles.noImage}>
                    <Ionicons name="receipt-outline" size={48} color="#cbd5e1" />
                    <Text style={styles.noImageText}>Brak zdjęcia paragonu</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                    <Ionicons name="trash" size={20} color="white" />
                    <Text style={styles.deleteBtnText}>Usuń ten wpis</Text>
                </TouchableOpacity>
        </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { padding: 20, backgroundColor: "#f8f9fe", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
    stationName: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
    date: { fontSize: 16, color: "#64748b", marginTop: 4 },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 10 },
    statItem: { width: "50%", padding: 10 },
    statLabel: { fontSize: 12, color: "#64748b", textTransform: "uppercase" },
    statValue: { fontSize: 18, fontWeight: "bold", color: "#2563eb", marginTop: 4 },
    imageContainer: { padding: 20 },
    label: { fontSize: 14, fontWeight: "bold", marginBottom: 10, color: "#1e293b" },
    image: { width: "100%", height: 300, borderRadius: 12, resizeMode: "cover" },
    noImage: { padding: 40, alignItems: "center", backgroundColor: "#f1f5f9", margin: 20, borderRadius: 12 },
    noImageText: { color: "#64748b", marginTop: 10 },
    deleteBtn: { flexDirection: "row", backgroundColor: "#ef4444", margin: 20, padding: 16, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    deleteBtnText: { color: "white", fontWeight: "bold", marginLeft: 8 },
})