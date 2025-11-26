import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppLayout } from '@/components/layout/app-layout';
import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppLayout>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="registro" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="perfil" options={{ headerShown: false }} />
            <Stack.Screen name="caso-detalle" options={{ headerShown: false }} />
            <Stack.Screen name="mis-donaciones" options={{ headerShown: false }} />
            <Stack.Screen name="historial-donaciones" options={{ headerShown: false }} />
            <Stack.Screen name="realizar-donacion" options={{ headerShown: false }} />
            <Stack.Screen name="notificaciones" options={{ headerShown: false }} />
            <Stack.Screen name="busqueda" options={{ headerShown: false }} />
            <Stack.Screen name="mi-impacto" options={{ headerShown: false }} />
            <Stack.Screen name="contactanos" options={{ headerShown: false }} />
            <Stack.Screen name="ajustes" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </AppLayout>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
