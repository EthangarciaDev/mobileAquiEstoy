# Integración de Casos con Firebase Firestore

## ✅ Implementación Completada

Se ha integrado completamente la app con Firebase Firestore para consumir casos reales desde la base de datos.

## 📦 Archivos Creados/Actualizados

### 1. **`utils/casosService.ts`** - Servicio de Firestore para Casos

Funciones disponibles:

- **`obtenerTodosCasos()`** - Obtiene todos los casos de la colección
- **`obtenerCasoPorId(id)`** - Obtiene un caso específico por ID
- **`obtenerCasosActivos()`** - Obtiene solo casos con estado "Activo"
- **`obtenerCasosPorPrioridad(prioridad)`** - Filtra por prioridad (Alta, Media, Baja)
- **`obtenerCasosDestacados(limite)`** - Obtiene casos destacados
- **`buscarCasosPorUbicacion(ubicacion)`** - Búsqueda por ubicación
- **`buscarCasosPorTipo(tipoAyuda)`** - Búsqueda por tipo de ayuda
- **`obtenerMensajeAgradecimiento(casoId)`** - Obtiene mensaje de la subcolección
- **`buscarCasosGeneral(termino)`** - Búsqueda general en múltiples campos

### 2. **Pantallas Actualizadas**

#### `app/(tabs)/index.tsx` - Pantalla de Inicio
- ✅ Carga casos desde Firebase al iniciar
- ✅ Muestra casos destacados
- ✅ Muestra casos cercanos
- ✅ Lista de todos los casos
- ✅ Pull-to-refresh para recargar datos
- ✅ Indicador de carga inicial

#### `app/(tabs)/explore.tsx` - Pantalla de Mapa
- ✅ Carga casos activos desde Firebase
- ✅ Muestra marcadores en el mapa
- ✅ Vista de lista de casos cercanos
- ✅ Indicador de carga

#### `app/caso-detalle.tsx` - Detalle de Caso
- ✅ Carga caso específico por ID desde Firebase
- ✅ Manejo de errores si el caso no existe
- ✅ Indicador de carga

## 🗄️ Mapeo de Estructura Firestore

### Colección: `casos`

Estructura esperada en Firestore (según tus capturas):

```typescript
{
  // Campos requeridos
  nombre: string,           // Se mapea a caso.titulo
  descripcion: string,      // Descripción del caso
  estado: string,           // "Activo", "En proceso", "Completado"
  ubicacion: string,        // Ubicación del caso
  prioridad: string,        // "Alta", "Media", "Baja"
  petición: string,         // Tipo de ayuda necesaria (se mapea a tipoAyuda)
  
  // Campos opcionales
  infoAdicional?: string,   // Información detallada adicional
  imagen?: string,          // URL de la imagen principal
  imagenes?: string[],      // Array de URLs de imágenes
  coordenadas?: {
    latitud: number,
    longitud: number
  },
  distancia?: number,       // Distancia calculada
  fecha?: string,           // Fecha de creación
  beneficiario?: string,    // Nombre del beneficiario
  intermediario?: string,   // Intermediario si existe
  destacado?: boolean       // Si el caso es destacado
}
```

### Subcolección: `mensaje_agradecimiento`

```typescript
{
  donador: string,
  mensaje: string
}
```

## 🚀 Cómo Usar

### 1. En cualquier componente:

```typescript
import { obtenerCasosActivos, obtenerCasoPorId } from '@/utils/casosService';

// Obtener todos los casos activos
const casos = await obtenerCasosActivos();

// Obtener un caso específico
const caso = await obtenerCasoPorId('atr9DgoPjni9U1ld2yN1');

// Buscar casos
const resultados = await buscarCasosGeneral('alimentos');
```

### 2. Estructura de datos que recibe la app:

El servicio convierte automáticamente los documentos de Firestore al tipo `Caso` de TypeScript usado en toda la app:

```typescript
interface Caso {
  id: string;
  titulo: string;              // De Firestore: nombre
  descripcion: string;
  descripcionCompleta?: string; // De Firestore: infoAdicional
  img: string;
  imagenes?: string[];
  ubicacion: string;
  coordenadas?: { latitud: number; longitud: number };
  distancia?: number;
  fecha: string;
  tipoAyuda: string;           // De Firestore: petición
  prioridad: 'Alta' | 'Media' | 'Baja';
  beneficiario: string;
  intermediario?: string;
  estado: 'Activo' | 'En proceso' | 'Completado';
  destacado?: boolean;
}
```

## ✨ Características Implementadas

### Pull-to-Refresh
Las pantallas de inicio y explorar soportan "pull-to-refresh" para recargar los casos:

```typescript
<ScrollView
  refreshControl={
    <RefreshControl refreshing={refrescando} onRefresh={handleRefresh} />
  }
>
```

### Indicadores de Carga
Todas las pantallas muestran un indicador mientras cargan datos:

```typescript
{cargando ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    <Text style={styles.loadingText}>Cargando casos...</Text>
  </View>
) : (
  // Contenido
)}
```

### Manejo de Errores
- Si un caso no existe, se muestra mensaje de error
- Si falla la conexión, se maneja gracefully
- Fallbacks para queries que requieren índices

## 📝 Campos Importantes de Firestore

Asegúrate de que tus documentos en Firestore tengan estos campos mínimos:

**Requeridos:**
- `nombre` - Título del caso
- `descripcion` - Descripción breve
- `ubicacion` - Ubicación del caso
- `prioridad` - "Alta", "Media" o "Baja"
- `estado` - "Activo", "En proceso" o "Completado"
- `petición` - Tipo de ayuda

**Opcionales pero recomendados:**
- `imagen` - URL de imagen principal
- `infoAdicional` - Información extra
- `coordenadas` - Para mostrar en el mapa
- `destacado` - Para casos destacados
- `fecha` - Fecha de creación

## 🔍 Próximas Mejoras Recomendadas

1. **Paginación** - Cargar casos en lotes para mejorar performance
2. **Caché local** - Guardar casos en AsyncStorage
3. **Filtros avanzados** - Por fecha, distancia, múltiples criterios
4. **Búsqueda en tiempo real** - Listeners de Firestore
5. **Índices compuestos** - Para queries más complejas
6. **Imágenes optimizadas** - Usar thumbnails para lista

## 🐛 Troubleshooting

**Error: "Missing or insufficient permissions"**
- Verifica las reglas de seguridad de Firestore
- Asegúrate de que la colección `casos` sea accesible

**Error: "The query requires an index"**
- Firestore mostrará un link para crear el índice
- O usa el fallback en cliente que ya implementamos

**Casos no aparecen:**
- Verifica que tengas documentos en la colección `casos`
- Revisa que los campos tengan los nombres correctos
- Checa la consola para ver errores específicos

## 📊 Estado Actual

✅ Servicio de Firestore completo
✅ Pantalla de inicio integrada
✅ Pantalla de mapa integrada  
✅ Pantalla de detalle integrada
✅ Indicadores de carga
✅ Manejo de errores
✅ Pull-to-refresh
✅ TypeScript completamente tipado

¡Todo listo para consumir casos reales desde Firebase! 🎉
