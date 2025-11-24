import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  SafeAreaView,
  Dimensions,
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { MenuItem } from '@/types';
import { mockUsuario } from '@/constants/mockData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(300, Math.round(SCREEN_WIDTH * 0.78));

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export function DrawerMenu({ isOpen, onClose, menuItems }: DrawerMenuProps) {
  const router = useRouter();
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isOpen, drawerAnim]);

  const getIconName = (key: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'inicio': 'home',
      'login': 'log-in',
      'registro': 'person-add',
      'perfil': 'person',
      'mis-donaciones': 'gift',
      'historial-donaciones': 'time',
      'mi-impacto': 'stats-chart',
      'busqueda': 'search',
      'notificaciones': 'notifications',
      'contactanos': 'mail',
      'ajustes': 'settings',
    };
    return iconMap[key] || 'ellipse';
  };

  const handleItemPress = (key: string) => {
    onClose();
    
    const routeMap: { [key: string]: string } = {
      'inicio': '/(tabs)',
      'login': '/login',
      'registro': '/registro',
      'perfil': '/perfil',
      'mis-donaciones': '/mis-donaciones',
      'historial-donaciones': '/historial-donaciones',
      'mi-impacto': '/mi-impacto',
      'busqueda': '/busqueda',
      'notificaciones': '/notificaciones',
      'contactanos': '/contactanos',
      'ajustes': '/ajustes',
    };

    const route = routeMap[key];
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={[styles.overlay, isOpen ? { display: 'flex' } : { display: 'none' }]}
      />

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: drawerAnim }],
          },
        ]}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header del drawer con perfil de usuario */}
          <View style={styles.drawerHeader}>
            <Image
              source={{ uri: mockUsuario.fotoPerfil }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{mockUsuario.nombre}</Text>
            <Text style={styles.userEmail}>{mockUsuario.correo}</Text>
          </View>

          {/* Menú items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.drawerItem}
                onPress={() => handleItemPress(item.key)}
              >
                <Ionicons 
                  name={getIconName(item.key)} 
                  size={24} 
                  color={theme.colors.primary} 
                  style={styles.itemIcon}
                />
                <Text style={styles.drawerItemText}>{item.label}</Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flex: 1 }} />

          {/* Footer */}
          <View style={styles.drawerFooter}>
            <Text style={styles.drawerVersion}>Aquí Estoy v1.0</Text>
            <Text style={styles.drawerCopyright}>© 2025 - Conectando corazones</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 56,
    right: 0,
    bottom: 56,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 30,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 56,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    zIndex: 40,
    elevation: 8,
  },
  drawerHeader: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  menuContainer: {
    paddingVertical: 8,
  },
  drawerItem: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  itemIcon: {
    marginRight: 16,
  },
  drawerItemText: { 
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    fontWeight: '500',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  drawerVersion: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  drawerCopyright: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
