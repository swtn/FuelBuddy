import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';

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
})

const DATA = [
  {id: 1, date: '2026-03-01', amount: '250.00 PLN', station: 'Orlen', fuelType: 'Diesel'},
  {id: 2, date: '2026-03-15', amount: '300.00 PLN', station: 'Shell', fuelType: 'Petrol'},
  {id: 3, date: '2026-04-01', amount: '275.00 PLN', station: 'Lotos', fuelType: 'Diesel'},
  {id: 4, date: '2026-04-15', amount: '320.00 PLN', station: 'BP', fuelType: 'Petrol'},
]

export default function JournalScreen() {
  const renderItem = ({ item } : { item: typeof DATA[0] }) => (
    <View style={styles.itemContainer}>
    <View>
      <Text style={styles.stationName}>{item.station}</Text>
      <Text style={styles.dateText}>{item.date}</Text>
    </View>
    <Text style={styles.ammountText}>{item.amount}</Text>
    </View>
  ) 

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
 