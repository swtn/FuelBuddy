import { useFuel } from '@/context/FuelContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ServiceScreen() {
  const { state, updateVehicleInfo } = useFuel();
  const [isEditing, setIsEditing] = useState(false);

  const [tempInfo, setTempInfo] = useState(state.vehicleInfo);

  const currentOdometer = state.entries.length > 0 
    ? Math.max(...state.entries.map(e => Number(e.odometer))) 
    : 0;

  const kmSinceOil = currentOdometer - state.vehicleInfo.lastOilChangeKm;
  const kmToNextOil = state.vehicleInfo.nextServiceKm - kmSinceOil;

  const handleSave = async () => {
    await updateVehicleInfo(tempInfo);
    setIsEditing(false);
  };

  const renderStatusCard = (title: string, value: string, subValue: string, icon: any, color: string) => (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardSubValue}>{subValue}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status Pojazdu</Text>
        <TouchableOpacity onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <Ionicons 
            name={isEditing ? "checkmark-circle" : "settings-outline"} 
            size={28} 
            color="#2563eb" 
          />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.form}>
          <Text style={styles.label}>Co ile km wymiana oleju?</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="numeric" 
            value={tempInfo.nextServiceKm.toString()}
            onChangeText={(val) => setTempInfo({ ...tempInfo, nextServiceKm: Number(val) || 0 })}
          />
          <Text style={styles.label}>Licznik przy ostatniej wymianie oleju:</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="numeric"
            value={tempInfo.lastOilChangeKm.toString()}
            onChangeText={(val) => setTempInfo({ ...tempInfo, lastOilChangeKm: Number(val) || 0 })}
          />
          <Text style={styles.label}>Data ważności przeglądu (RRRR-MM-DD):</Text>
          <TextInput 
            style={styles.input}
            value={tempInfo.techReviewDate}
            onChangeText={(val) => setTempInfo({ ...tempInfo, techReviewDate: val })}
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.odometerBadge}>
            <Text style={styles.odoLabel}>Aktualny przebieg (z dziennika):</Text>
            <Text style={styles.odoValue}>{currentOdometer} km</Text>
          </View>

          {renderStatusCard(
            "Serwis olejowy",
            kmToNextOil > 0 ? `Zostało ok. ${kmToNextOil} km` : "WYMIEŃ OLEJ!",
            `Ostatnia wymiana: ${state.vehicleInfo.lastOilChangeKm} km`,
            "water",
            kmToNextOil > 1000 ? "#10b981" : "#ef4444"
          )}

          {renderStatusCard(
            "Badanie techniczne",
            state.vehicleInfo.techReviewDate,
            "Pamiętaj o wizycie na stacji diagnostycznej",
            "calendar",
            "#2563eb"
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  form: { padding: 20 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  saveButton: { backgroundColor: '#2563eb', padding: 15, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  content: { padding: 20 },
  odometerBadge: { backgroundColor: '#2563eb', padding: 20, borderRadius: 20, marginBottom: 20 },
  odoLabel: { color: '#bfdbfe', fontSize: 14 },
  odoValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 2 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, color: '#64748b' },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  cardSubValue: { fontSize: 12, color: '#94a3b8' }
});