# Autenticación Firebase - Aquí Estoy

## ✅ Implementación Completada

Se ha implementado un sistema completo de autenticación con Firebase que incluye:

### 🔧 Archivos Creados

1. **`utils/firebase.ts`** - Servicio de Firebase
   - `registrarUsuario()` - Crea usuario en Auth y guarda datos en Firestore
   - `iniciarSesion()` - Autentica usuario con email/password
   - `cerrarSesion()` - Cierra la sesión actual
   - `obtenerDatosUsuario()` - Obtiene datos del usuario desde Firestore
   - `observarEstadoAuth()` - Observa cambios en el estado de autenticación

2. **`contexts/AuthContext.tsx`** - Contexto global
   - Maneja el estado del usuario autenticado
   - Carga automáticamente los datos del usuario
   - Proporciona `useAuth()` hook para acceder al usuario

3. **`constants/firebaseConfig.ts`** - Configuración de Firebase
   - Lee credenciales desde variables de entorno

4. **`.env`** - Variables de entorno (no se sube al repo)
   - Contiene tus credenciales de Firebase

### 📱 Pantallas Actualizadas

- **`app/login.tsx`** - Conectado a Firebase
  - Valida credenciales
  - Muestra errores específicos de Firebase
  - Indicador de carga durante autenticación

- **`app/registro.tsx`** - Conectado a Firebase
  - Crea usuario en Authentication
  - Guarda datos adicionales en Firestore colección "Usuario"
  - Validación completa de formulario

### 🗄️ Estructura de Firestore

La app guarda los usuarios en la colección `Usuario` con esta estructura:

```typescript
{
  id: string,                    // UID de Firebase Auth
  nombre: string,
  correo: string,
  telefono: string,
  ubicacion: string,
  zonaDonacionHabitual: string,
  preferenciasNotificacion: {
    nuevoCasos: boolean,
    actualizacionesDonaciones: boolean,
    mensajesAgradecimiento: boolean
  },
  fechaRegistro: string          // ISO 8601
}
```

### 🚀 Cómo Usar

#### 1. Iniciar la App
```bash
npm start
```

#### 2. Probar Registro
- Ve a la pantalla de registro
- Llena el formulario con datos válidos
- La app creará el usuario en Firebase y lo guardará en Firestore

#### 3. Probar Login
- Ve a la pantalla de login
- Ingresa email y contraseña de un usuario registrado
- La app autenticará y redirigirá a las tabs

#### 4. Acceder al Usuario en Cualquier Componente
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MiComponente() {
  const { user, userData, loading } = useAuth();
  
  if (loading) return <Text>Cargando...</Text>;
  if (!user) return <Text>No autenticado</Text>;
  
  return <Text>Hola {userData?.nombre}</Text>;
}
```

#### 5. Cerrar Sesión
```typescript
import { cerrarSesion } from '@/utils/firebase';

const handleLogout = async () => {
  const resultado = await cerrarSesion();
  if (resultado.success) {
    router.replace('/login');
  }
};
```

### 🔒 Seguridad

- ✅ Las credenciales están en `.env` (no se suben al repo)
- ✅ `.env` está en `.gitignore`
- ✅ Validación de email y contraseña
- ✅ Manejo de errores de Firebase traducidos al español
- ✅ Estados de carga para prevenir múltiples envíos

### 📝 Próximos Pasos Recomendados

1. **Recuperar contraseña** - Agregar `sendPasswordResetEmail()`
2. **Verificación de email** - Usar `sendEmailVerification()`
3. **Proteger rutas** - Redirigir a login si no está autenticado
4. **Actualizar perfil** - Permitir editar datos del usuario
5. **Eliminar cuenta** - Agregar opción de borrar cuenta

### 🐛 Troubleshooting

Si encuentras errores:

1. **"Module not found: Constants"** → Asegúrate de tener `expo-constants` instalado
2. **"Firebase not initialized"** → Verifica que `.env` tenga las credenciales correctas
3. **"Network error"** → Revisa tu conexión a internet

### 📚 Documentación de Referencia

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Expo Constants](https://docs.expo.dev/versions/latest/sdk/constants/)
