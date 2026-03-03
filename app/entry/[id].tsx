// app/entry/[id].tsx
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useFuel } from '../../context/FuelContext';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const { state, deleteEntry } = useFuel();
  const router = useRouter();

  // Znajdź wpis po ID
  const entry = state.entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text>Nie znaleziono wpisu.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteEntry(entry.id);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: entry.station }} />
      
      <View style={styles.card}>
        <Text style={styles.label}>Stacja</Text>
        <Text style={styles.value}>{entry.station}</Text>
        
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>{entry.date}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Kwota</Text>
            <Text style={[styles.value, styles.amount]}>{entry.amount.toFixed(2)} PLN</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Cena/Litr</Text>
            <Text style={styles.value}>{entry.price.toFixed(2)} PLN</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Litrów</Text>
            <Text style={styles.value}>{entry.liters.toFixed(2)} L</Text>
          </View>
        </View>

        {entry.image ? (
          <>
            <Text style={styles.label}>Zdjęcie paragonu</Text>
            <Image source={{ uri: entry.image }} style={styles.image} />
          </>
        ) : (
          <Text style={styles.noImageText}>Brak zdjęcia paragonu</Text>
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="white" />
        <Text style={styles.deleteButtonText}>Usuń wpis</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 5,
  },
  amount: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    flex: 0.48,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'contain',
    backgroundColor: '#eee',
  },
  noImageText: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30', 
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});