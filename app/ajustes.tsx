import React from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet } from 'react-native';

export default function AjustesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
      <Text style={styles.description}>Configura tu cuenta y notificaciones.</Text>
      
      <View style={styles.buttonSpacing}>
        <Button 
          title="Cambiar Contraseña" 
          onPress={() => Alert.alert('Función no disponible')} 
        />
      </View>
      
      <View style={styles.buttonSpacing}>
        <Button 
          title="Privacidad" 
          onPress={() => Alert.alert('Función no disponible')} 
        />
      </View>
      
      <View style={styles.buttonSpacing}>
        <Button 
          title="Notificaciones" 
          onPress={() => Alert.alert('Función no disponible')} 
        />
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
  buttonSpacing: { 
    marginBottom: 12 
  },
});
