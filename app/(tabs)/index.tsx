import { FuelEntry, useFuel } from "@/context/FuelContext";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function JournalScreen() {
  const { state, deleteEntry } = useFuel();

  const handleDelete = (id: string) => {
    Alert.alert("Usuń wpis", "Czy na pewno chcesz usunąć ten wpis?", [
      {
        text: "Anuluj",
        style: "cancel",
      },
      {
        text: "Usuń",
        style: "destructive",
        onPress: () => deleteEntry(id),
      },
    ]);
  };

  const stats = useMemo(() => {
    if (state.entries.length === 0) return { totalCost: 0, avgConsumption: 0 };

    const totalCost = state.entries.reduce(
      (sum, entry) => sum + (Number(entry.totalCost) || 0),
      0,
    );

    let avgConsumption = 0;
    if (state.entries.length >= 2) {
      const sortedEntries = [...state.entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const latest = sortedEntries[0];
      const oldest = sortedEntries[sortedEntries.length - 1];
      const totalLiters = sortedEntries
        .slice(0, -1)
        .reduce((sum, e) => sum + (Number(e.liters) || 0), 0);
      const distance = latest.odometer - oldest.odometer;

      if (distance > 0) {
        avgConsumption = (totalLiters / distance) * 100;
      }
    }

    return { totalCost, avgConsumption };
  }, [state.entries]);

  const renderItem = ({ item }: { item: FuelEntry }) => {
    const formattedDate = new Date(item.date).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Ionicons name="car-outline" size={24} color="#2563eb" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardStation}>{item.station}</Text>
          <Text style={styles.cardDate}>
            {formattedDate} • {item.odometer} km
          </Text>
        </View>
        <View style={styles.cardAmount}>
          <Text style={styles.cardPrice}>
            {(Number(item.totalCost) || 0).toFixed(2)} PLN
          </Text>
          <Text style={styles.cardLiters}>{item.liters} l</Text>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={{ marginTop: 8 }}
          >
            <Ionicons name="trash" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Średnie spalanie</Text>
          <Text style={styles.statValue}>
            {stats.avgConsumption > 0 ? stats.avgConsumption.toFixed(2) : "--"}
            <Text style={styles.statUnit}> l/100km</Text>
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Suma wydatków</Text>
          <Text style={styles.statValue}>
            {(Number(stats.totalCost) || 0).toFixed(2)}
            <Text style={styles.statUnit}> PLN</Text>
          </Text>
        </View>
      </View>

      <FlatList
        data={state.entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Brak wpisów. Dodaj pierwsze tankowanie!
            </Text>
          </View>
        }
      />

      <Link href="/modal" asChild>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statLabel: { fontSize: 12, color: "#64748b", marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  statUnit: { fontSize: 12, fontWeight: "normal", color: "#94a3b8" },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    elevation: 1,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardStation: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  cardDate: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  cardAmount: { alignItems: "flex-end" },
  cardPrice: { fontSize: 15, fontWeight: "bold", color: "#2563eb" },
  cardLiters: { fontSize: 12, color: "#64748b" },
  emptyState: { marginTop: 100, alignItems: "center" },
  emptyText: { color: "#94a3b8", fontSize: 16 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2563eb",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
