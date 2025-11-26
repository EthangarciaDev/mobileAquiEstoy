import { useAuth } from '@/context/AuthContext';
import { cerrarSesion } from '@/utils/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import styles from './styles';
import { DrawerMenuProps } from './types';

export default function DrawerMenu({ isOpen, onClose, onNavigate }: DrawerMenuProps) {
  const { user } = useAuth();

  const handleLogout = async () => {
    const result = await cerrarSesion();
    if (result.success) {
      onClose();
      router.replace('/login');
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* ...existing menu items... */}

        <View style={{ borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: 16, paddingTop: 16 }}>
          <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 8, paddingHorizontal: 16 }}>
            {user?.email}
          </Text>
          <Pressable
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={[styles.menuText, { color: '#ef4444' }]}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
}