import { useAuth } from '@/context/AuthContext';
import { MenuItem, Usuario } from '@/types';
import { cerrarSesion, obtenerDatosUsuario } from '@/utils/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const ICON_MAP: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  inicio: 'home-outline',
  perfil: 'person-outline',
  busqueda: 'search-outline',
  notificaciones: 'notifications-outline',
  'mi-impacto': 'trophy-outline',
  'historial-donaciones': 'time-outline',
  contactanos: 'mail-outline',
  ajustes: 'settings-outline',
};

export function DrawerMenu({ isOpen, onClose, menuItems }: DrawerMenuProps) {
  const { user, isAuthenticated } = useAuth();
  const [slideAnim] = useState(new Animated.Value(-300));
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🍔 DrawerMenu - isAuthenticated:', isAuthenticated, 'user:', user?.email);
    
    if (isAuthenticated && user) {
      cargarDatosUsuario();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const cargarDatosUsuario = async () => {
    if (!user?.uid) {
      console.log('🍔 DrawerMenu - No hay UID de usuario');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🍔 DrawerMenu - Cargando datos del usuario:', user.uid);
      const datos = await obtenerDatosUsuario(user.uid);
      console.log('🍔 DrawerMenu - Datos cargados:', datos?.nombre);
      setUserData(datos);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const handleNavigate = (key: string) => {
    console.log('🍔 DrawerMenu - Navegando a:', key);
    onClose();
    
    const routes: { [key: string]: string } = {
      inicio: '/(tabs)',
      perfil: '/perfil',
      busqueda: '/busqueda',
      notificaciones: '/notificaciones',
      'mi-impacto': '/mi-impacto',
      'historial-donaciones': '/historial-donaciones',
      contactanos: '/contactanos',
      ajustes: '/ajustes',
    };

    const route = routes[key];
    if (route) {
      router.push(route as any);
    }
  };

  const handleLogout = () => {
    console.log('🍔 DrawerMenu - Solicitando cerrar sesión...');
    
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🍔 DrawerMenu - Cerrando sesión...');
              onClose();
              const result = await cerrarSesion();
              if (result.success) {
                console.log('✅ Sesión cerrada exitosamente');
                // El AuthContext detectará el cambio y redirigirá automáticamente
                router.replace('/login');
              } else {
                console.error('❌ Error al cerrar sesión:', result.error);
                Alert.alert('Error', 'No se pudo cerrar sesión. Por favor intenta de nuevo.');
              }
            } catch (error) {
              console.error('❌ Error inesperado al cerrar sesión:', error);
              Alert.alert('Error', 'Ocurrió un error inesperado al cerrar sesión.');
            }
          }
        }
      ]
    );
  };

  if (!isOpen) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
          onStartShouldSetResponder={() => true}
        >
          <ScrollView style={styles.content}>
            {/* User Profile Section */}
            <View style={styles.profileSection}>
              {loading ? (
                <ActivityIndicator size="small" color="#2563eb" />
              ) : (
                <>
                  <Image
                    source={
                      userData?.fotoPerfil
                        ? { uri: userData.fotoPerfil }
                        : require('@/assets/images/fotoperfil.jpeg')
                    }
                    style={styles.avatar}
                  />
                  <Text style={styles.userName}>{userData?.nombre || user?.displayName || 'Usuario'}</Text>
                  <Text style={styles.userEmail}>{user?.email || ''}</Text>
                </>
              )}
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              {menuItems.map((item) => (
                <Pressable
                  key={item.key}
                  style={styles.menuItem}
                  onPress={() => handleNavigate(item.key)}
                >
                  <Ionicons
                    name={ICON_MAP[item.key]}
                    size={24}
                    color="#374151"
                  />
                  <Text style={styles.menuText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  drawer: {
    width: 280,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#374151',
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
    paddingTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
});
