import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFuel } from "../../context/FuelContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  stationText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  dateText: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2563eb",
  },
  currencyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#1e293b",
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 40,
    fontSize: 15,
  },
});

export default function JournalScreen() {
  const { state } = useFuel();

  const renderItem = ({ item }: { item: (typeof state.entries)[0] }) => (
    <Link href={`/entry/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="wallet-outline" size={24} color="#2563eb" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.stationText}>{item.station}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountValue}>{item.amount.toFixed(2)}</Text>
          <Text style={styles.currencyText}>PLN</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={state.entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Brak wpisów. Dodaj pierwszy!</Text>
        }
      />
      <Link href="/modal" style={styles.addButton} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
