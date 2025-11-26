import { MenuItem } from '@/types';
import { usePathname } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { DrawerMenu } from './drawer-menu';
import { Footer } from './footer';
import { Header } from './header';

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
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Verificar si estamos en una página pública (sin header/footer/menu)
  const isPublicPage = pathname === '/login' || pathname === '/registro';

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={styles.container}>
        {!isPublicPage && <Header onMenuPress={toggleMenu} />}
        
        <View style={styles.main}>
          {children}
        </View>

        {!isPublicPage && <Footer />}

        {!isPublicPage && (
          <DrawerMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            menuItems={MENU_ITEMS}
          />
        )}
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
