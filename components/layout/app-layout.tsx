import { useAuth } from '@/context/AuthContext';
import { MenuItem } from '@/types';
import { router, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
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

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isAuthenticated, loading, user } = useAuth();

  // No mostrar layout en login y registro
  const isAuthScreen = pathname === '/login' || pathname === '/registro';
  
  console.log('🏗️ AppLayout - pathname:', pathname);
  console.log('   - isAuthScreen:', isAuthScreen);
  console.log('   - loading:', loading);
  console.log('   - isAuthenticated:', isAuthenticated);
  console.log('   - user:', user?.email || 'null');

  // Si no es pantalla de auth y no está autenticado, no mostrar el layout
  useEffect(() => {
    if (!isAuthScreen && !loading && !isAuthenticated) {
      console.log('⚠️ AppLayout: Usuario no autenticado en pantalla protegida, redirigiendo...');
      router.replace('/login');
    }
  }, [isAuthScreen, loading, isAuthenticated]);

  // Pantallas de autenticación: solo mostrar children sin layout
  if (isAuthScreen) {
    console.log('   - Mostrando solo children (sin header/drawer)');
    return <>{children}</>;
  }

  // Mientras está cargando
  if (loading) {
    console.log('   - Cargando autenticación...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // Si no está autenticado en una pantalla protegida
  if (!isAuthenticated) {
    console.log('   - No autenticado, esperando redirección...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  console.log('   - Mostrando layout completo (con header/drawer)');

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={styles.container}>
        <Header onMenuPress={() => setIsDrawerOpen(true)} />
        
        <View style={styles.main}>
          {children}
        </View>

        <Footer />

        <DrawerMenu
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
