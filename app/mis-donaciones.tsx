import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function MisDonacionesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Donaciones Activas</Text>
      <Text style={styles.description}>Estos son los casos en los que estás participando actualmente.</Text>
     
      <View style={styles.historialCard}>
        <Text style={styles.historialCardTitle}>Caso: Ropa para la familia Pérez</Text>
        <Text style={styles.historialCardDate}>Estado: Activo</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    paddingBottom: 80, 
    backgroundColor: '#ECF0F1', 
    minHeight: '100%' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#2C3E50', 
    textAlign: 'center', 
    marginBottom: 12 
  },
  description: { 
    textAlign: 'center', 
    marginBottom: 14, 
    color: '#555' 
  },
  historialCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  historialCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  historialCardDate: {
    fontSize: 14,
    color: '#555',
  },
});
