// app/modal.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useFuel } from '../context/FuelContext';

export default function ModalScreen() {
  const [station, setStation] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [liters, setLiters] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  const router = useRouter();
  const { addEntry } = useFuel();

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Odmówiono dostępu do kamery!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddEntry = () => {
    if (!station || !pricePerLiter || !liters) {
      Alert.alert('Błąd', 'Uzupełnij stację, cenę za litr i ilość litrów!');
      return;
    }

    const totalAmount = parseFloat(pricePerLiter) * parseFloat(liters);

    const newEntry = {
      id: Date.now().toString(),
      station,
      amount: totalAmount,
      date: new Date().toISOString().split('T')[0],
      price: parseFloat(pricePerLiter),
      liters: parseFloat(liters),
      image: image,
    };
    
    addEntry(newEntry);
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj nowy koszt</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nazwa stacji (np. Orlen)"
        value={station}
        onChangeText={setStation}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Cena za litr (PLN)"
        value={pricePerLiter}
        onChangeText={setPricePerLiter}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Ilość litrów"
        value={liters}
        onChangeText={setLiters}
        keyboardType="numeric"
      />

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      
      <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
        <Text style={styles.photoButtonText}>
          {image ? 'Zmień zdjęcie' : 'Zrób zdjęcie paragonu'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddEntry}>
        <Text style={styles.buttonText}>Dodaj wpis</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.Background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  photoButton: {
    backgroundColor: Colors.primaryLight,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    color: Colors.primaryDark,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});