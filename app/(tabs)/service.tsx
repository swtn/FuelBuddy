import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ServiceScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="construct-outline" size={80} color="#2563eb" />
      </View>
      <Text style={styles.title}>Moduł Serwisowy</Text>
      <Text style={styles.description}>
        Już niedługo będziesz mógł tutaj pilnować terminów wymiany oleju, 
        przeglądów technicznych oraz ubezpieczenia OC/AC.
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>W BUDOWIE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fe', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 30 
  },
  iconContainer: {
    backgroundColor: '#eff6ff',
    padding: 30,
    borderRadius: 50,
    marginBottom: 20
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  description: { 
    fontSize: 16, 
    color: '#64748b', 
    textAlign: 'center', 
    lineHeight: 24 
  },
  badge: {
    marginTop: 30,
    backgroundColor: '#cbd5e1',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});