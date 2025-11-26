import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { DrawerMenu } from '@/components/layout/drawer-menu';
import { Header } from '@/components/layout/header';
import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MenuItem } from '@/types';
import { View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Pantallas que NO deben mostrar el header
  const noHeaderScreens = ['/login', '/registro'];
  const shouldShowHeader = !noHeaderScreens.includes(pathname);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        {shouldShowHeader && <Header onMenuPress={() => setIsDrawerOpen(true)} />}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="registro" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="caso-detallado" />
          <Stack.Screen name="realizar-donacion" />
          <Stack.Screen name="busqueda" />
          <Stack.Screen name="perfil" />
          <Stack.Screen name="mis-donaciones" />
          <Stack.Screen name="historial-donaciones" />
          <Stack.Screen name="notificaciones" />
          <Stack.Screen name="ajustes" />
          <Stack.Screen name="contactanos" />
          <Stack.Screen name="mi-impacto" />
        </Stack>
        {shouldShowHeader && (
          <DrawerMenu
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            menuItems={MENU_ITEMS}
          />
        )}
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Aquí puedes cargar fuentes si las necesitas en el futuro
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
