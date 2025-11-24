# Aquí Estoy - Documentación de Estructura

## 📁 Estructura del Proyecto

```
AquiEstoy/
├── app/                          # Pantallas (rutas automáticas)
│   ├── (tabs)/                   # Navegación con tabs
│   │   ├── _layout.tsx           # Configuración de tabs
│   │   ├── index.tsx             # 🏠 Feed principal (/)
│   │   └── explore.tsx           # 🔍 Explorar
│   │
│   ├── login.tsx                 # 🔑 Login (/login)
│   ├── registro.tsx              # 📝 Registro (/registro)
│   ├── perfil.tsx                # 👤 Perfil (/perfil)
│   ├── caso-detalle.tsx          # 📋 Detalle de caso (/caso-detalle)
│   ├── mis-donaciones.tsx        # 💝 Mis donaciones (/mis-donaciones)
│   ├── historial-donaciones.tsx  # 📚 Historial (/historial-donaciones)
│   ├── contactanos.tsx           # 📧 Contacto (/contactanos)
│   └── ajustes.tsx               # ⚙️ Ajustes (/ajustes)
│
├── components/                   # Componentes reutilizables
│   ├── casos/
│   │   ├── caso-card.tsx         # Card de caso (para el feed)
│   │   └── caso-detalle.tsx      # Vista detallada de un caso
│   │
│   └── layout/
│       ├── header.tsx            # Header con menú hamburguesa
│       ├── footer.tsx            # Footer con redes sociales
│       └── drawer-menu.tsx       # Menú lateral (drawer)
│
├── constants/
│   ├── mockData.ts               # Datos mock (casos, donaciones)
│   └── theme.ts                  # Tema y colores (existente)
│
└── types/
    └── index.ts                  # Tipos TypeScript
```

---

## 🚀 Diferencias Clave vs React Web

### Navegación

**React Web:**
```jsx
import { BrowserRouter, Route } from 'react-router-dom';

<Route path="/login" element={<Login />} />
```

**React Native (Expo Router):**
```
app/
  login.tsx  →  Ruta automática: /login
```

### Componentes

| React Web | React Native |
|-----------|--------------|
| `<div>` | `<View>` |
| `<p>` | `<Text>` |
| `<a>` | `<Link>` o `<TouchableOpacity>` |
| CSS | `StyleSheet` |

---

## 📱 Flujo de la Aplicación

### 1. Pantalla Principal (Feed)
**Archivo:** `app/(tabs)/index.tsx`

- Muestra el logo y nombre de la app
- Barra de navegación rápida (Login, Registro, Perfil)
- Feed de casos con `CasoCard`
- Al hacer clic → navega a `/caso-detalle`

```tsx
<CasoCard 
  caso={caso} 
  onPress={() => router.push(`/caso-detalle?id=${caso.id}`)} 
/>
```

### 2. Detalle de Caso
**Archivo:** `app/caso-detalle.tsx`

- Recibe `id` por parámetros de URL
- Busca el caso en `mockCasosFeed`
- Muestra imagen, descripción, ubicación
- Botón "Quiero Ayudar"

### 3. Autenticación
**Archivos:** `app/login.tsx`, `app/registro.tsx`

- Formularios simples
- Simulan login/registro
- Navegan entre sí

### 4. Perfil
**Archivo:** `app/perfil.tsx`

- Modo edición/vista
- Foto de perfil
- Información personal
- Contador de ayudas
- Navegación a historial

### 5. Contacto
**Archivo:** `app/contactanos.tsx`

- Formulario de contacto
- Usa **AsyncStorage** para persistencia
- Lista de mensajes enviados
- CRUD completo (Crear, Leer, Editar, Eliminar)

---

## 🎨 Componentes Reutilizables

### CasoCard
**Uso:** Mostrar caso en el feed

```tsx
import { CasoCard } from '@/components/casos/caso-card';

<CasoCard 
  caso={casoData} 
  onPress={() => handlePress(casoData.id)} 
/>
```

### CasoDetalle
**Uso:** Vista completa de un caso

```tsx
import { CasoDetalle } from '@/components/casos/caso-detalle';

<CasoDetalle caso={casoData} />
```

### Header, Footer, DrawerMenu
**Uso:** Layout principal (si quisieras usarlos globalmente)

```tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DrawerMenu } from '@/components/layout/drawer-menu';
```

---

## 📦 Datos Mock

**Archivo:** `constants/mockData.ts`

```tsx
import { mockCasosFeed } from '@/constants/mockData';

// Array de 8 casos con:
// - id, titulo, descripcion
// - img, ubicacion, fecha
// - tipoAyuda, prioridad
```

---

## 🔧 Tipos TypeScript

**Archivo:** `types/index.ts`

```tsx
import { Caso, Donacion, MenuItem } from '@/types';

interface Caso {
  id: string;
  titulo: string;
  descripcion: string;
  img: string;
  ubicacion: string;
  fecha: string;
  tipoAyuda: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
}
```

---

## 🛠️ Cómo Agregar una Nueva Pantalla

### Paso 1: Crear archivo
```bash
# Crear pantalla nueva
touch app/nueva-pantalla.tsx
```

### Paso 2: Código básico
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NuevaPantallaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Pantalla</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ECF0F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});
```

### Paso 3: Navegar
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/nueva-pantalla');
```

---

## 🎯 Navegación entre Pantallas

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Navegación simple
router.push('/perfil');

// Navegación con parámetros
router.push(`/caso-detalle?id=${casoId}`);

// Volver atrás
router.back();

// Navegar y reemplazar (no permite volver)
router.replace('/login');
```

---

## 💾 Persistencia de Datos (AsyncStorage)

**Usado en:** `app/contactanos.tsx`

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar
await AsyncStorage.setItem('@key', JSON.stringify(data));

// Leer
const data = await AsyncStorage.getItem('@key');
const parsed = JSON.parse(data);

// Eliminar
await AsyncStorage.removeItem('@key');
```

---

## 🎨 Estilos (StyleSheet)

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Ocupa todo el espacio
    backgroundColor: '#ECF0F1', // Color de fondo
    padding: 20,                // Espaciado interno
  },
  button: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',       // Centra horizontalmente
    justifyContent: 'center',   // Centra verticalmente
  },
});
```

### Propiedades Comunes

| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| `flex` | Proporción del espacio | `flex: 1` |
| `flexDirection` | Dirección del flex | `'row'`, `'column'` |
| `justifyContent` | Alineación eje principal | `'center'`, `'space-between'` |
| `alignItems` | Alineación eje cruzado | `'center'`, `'flex-start'` |
| `padding` | Espaciado interno | `padding: 20` |
| `margin` | Espaciado externo | `margin: 10` |
| `borderRadius` | Bordes redondeados | `borderRadius: 8` |

---

## 🚦 Comandos Útiles

```bash
# Iniciar proyecto
npm start

# Limpiar cache
npm start -- --clear

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Verificar errores
npm run lint
```

---

## 📝 Buenas Prácticas

### 1. Organización de Componentes
- **Pequeños y específicos**: Cada componente hace una sola cosa
- **Reutilizables**: Usa props para personalizar
- **Bien nombrados**: Nombres descriptivos (CasoCard, not Card)

### 2. Estilos
- Usa `StyleSheet.create()` para performance
- Mantén estilos cerca del componente
- Usa constantes para colores repetidos

### 3. Navegación
- Usa rutas tipadas cuando sea posible
- Maneja casos de "no encontrado"
- Valida parámetros de URL

### 4. Estado
- Usa `useState` para estado local
- Usa AsyncStorage para persistencia
- Considera Context API para estado global

---

## 🔄 Próximos Pasos Sugeridos

1. **Integrar Firebase/Backend**
   - Reemplazar mockData con API real
   - Implementar autenticación real
   
2. **Mejorar UI/UX**
   - Agregar animaciones con Reanimated
   - Implementar skeleton loaders
   - Mejorar feedback visual

3. **Features Adicionales**
   - Sistema de chat
   - Notificaciones push
   - Geolocalización
   - Carga de imágenes

4. **Testing**
   - Tests unitarios (Jest)
   - Tests E2E (Detox)

---

## 🐛 Problemas Comunes

### Error: "Cannot find module"
```bash
# Limpiar cache e instalar
npm install
npm start -- --clear
```

### Error: TypeScript rutas
```tsx
// Usar 'as any' temporalmente
router.push('/ruta' as any);
```

### AsyncStorage no funciona
```bash
# Reinstalar dependencia
npm install @react-native-async-storage/async-storage
```

---

## 📚 Recursos Útiles

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript + React Native](https://reactnative.dev/docs/typescript)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

**¡Listo para desarrollar! 🚀**
