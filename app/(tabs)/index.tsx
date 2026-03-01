import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useFuel } from '../../context/FuelContext';
import { Link } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ammountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 32,
    fontSize: 16,
  },
})


export default function JournalScreen() {
  const { state } = useFuel();

  const renderItem = ({ item } : { item: typeof state.entries[0]}) => (
    <Link href={`/entry/${item.id}`} asChild>
    <TouchableOpacity style={styles.itemContainer}>
    <View>
      <Text style={styles.stationName}>{item.station}</Text>
      <Text style={styles.dateText}>{item.date}</Text>
    </View>
    <Text style={styles.ammountText}>{item.amount.toFixed(2)} PLN</Text>
    </TouchableOpacity>
    </Link>
  ) 

  return (
    <View style={styles.container}>
      <FlatList
        data={state.entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent = {
        <Text style={styles.emptyText}>Brak wpisów. Dodaj pierwszy!</Text>
      }
      />
      <Link href="/modal" style={styles.addButton} asChild>
        <TouchableOpacity>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
 