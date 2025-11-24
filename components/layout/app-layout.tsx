import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Header } from './header';
import { Footer } from './footer';
import { DrawerMenu } from './drawer-menu';
import { MenuItem } from '@/types';

interface AppLayoutProps {
  children: React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  { key: 'inicio', label: 'Inicio' },
  { key: 'perfil', label: 'Mi Perfil' },
  { key: 'busqueda', label: 'Buscar Casos' },
  { key: 'notificaciones', label: 'Notificaciones' },
  { key: 'mi-impacto', label: 'Mi Impacto' },
  { key: 'historial-donaciones', label: 'Historial de Donaciones' },
  { key: 'contactanos', label: 'Contáctanos' },
  { key: 'ajustes', label: 'Configuración' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={styles.container}>
        <Header onMenuPress={toggleMenu} />
        
        <View style={styles.main}>
          {children}
        </View>

        <Footer />

        <DrawerMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          menuItems={MENU_ITEMS}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    flex: 1,
  },
});
