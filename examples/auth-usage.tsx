// Ejemplo de uso del sistema de autenticación
// Este archivo muestra cómo usar Firebase Auth en tus componentes

import { useAuth } from '@/contexts/AuthContext';
import { cerrarSesion } from '@/utils/firebase';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function EjemploUsoAuth() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  // Mientras carga
  if (loading) {
    return <Text>Cargando...</Text>;
  }

  // Usuario no autenticado
  if (!user) {
    return (
      <View>
        <Text>No has iniciado sesión</Text>
        <Button title="Ir a Login" onPress={() => router.push('/login')} />
      </View>
    );
  }

  // Usuario autenticado
  const handleLogout = async () => {
    const resultado = await cerrarSesion();
    if (resultado.success) {
      router.replace('/login');
    }
  };

  return (
    <View>
      <Text>Hola {userData?.nombre || user.displayName}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Ubicación: {userData?.ubicacion}</Text>
      <Text>Teléfono: {userData?.telefono}</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
}

/* 
CASOS DE USO COMUNES:

1. Proteger una pantalla (requiere autenticación):
   
   function PantallaProtegida() {
     const { user, loading } = useAuth();
     
     if (loading) return <ActivityIndicator />;
     if (!user) {
       router.replace('/login');
       return null;
     }
     
     return <MiContenido />;
   }

2. Mostrar nombre del usuario:
   
   const { userData } = useAuth();
   <Text>{userData?.nombre}</Text>

3. Verificar si está autenticado:
   
   const { user } = useAuth();
   if (user) {
     // Usuario autenticado
   }

4. Obtener UID del usuario:
   
   const { user } = useAuth();
   const uid = user?.uid;

5. Verificar email verificado:
   
   const { user } = useAuth();
   if (user?.emailVerified) {
     // Email verificado
   }
*/
