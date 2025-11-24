import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HeaderProps {
  onMenuPress: () => void;
}

export function Header({ onMenuPress }: HeaderProps) {
  return (
    <SafeAreaView style={styles.headerSafe}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onMenuPress} 
          style={styles.menuButton} 
          accessibilityLabel="Abrir menú"
        >
          <Text style={styles.hamburger}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aquí Estoy</Text>
        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: { 
    backgroundColor: '#f8f8f8' 
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
    justifyContent: 'space-between',
  },
  menuButton: { 
    padding: 8 
  },
  hamburger: { 
    fontSize: 26 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600' 
  },
});
