# Script: Crear Casos de Ejemplo

## ✅ Casos Creados Exitosamente

Se crearon **5 casos de ejemplo** en Firestore con los siguientes IDs:

1. **jnSZQFqn8ASDIWgpf3Ws** - Apoyo con alimentos para familia numerosa (Alta prioridad, Destacado)
2. **b03BnLClZjDoz96HaZaO** - Donación de ropa de invierno para adulto mayor (Media prioridad)
3. **B1ll9WvfZ1QvRVEfSGLx** - Medicamentos para tratamiento crónico (Alta prioridad, Destacado)
4. **o0FQ6xOqZo6ckYoDvi10** - Útiles escolares para estudiante de primaria (Media prioridad)
5. **Pw6BhlKblc5wFuDHDYYI** - Silla de ruedas para persona con discapacidad (Alta prioridad, Destacado)

## 📝 Contenido de los Casos

Cada caso incluye:
- ✅ **nombre** - Título descriptivo
- ✅ **descripcion** - Descripción breve
- ✅ **infoAdicional** - Detalles completos del caso
- ✅ **ubicacion** - Ubicación en Ciudad de México/Estado de México
- ✅ **prioridad** - Alta o Media
- ✅ **estado** - Todos en "Activo"
- ✅ **peticion** - Tipo de ayuda (alimentos, ropa, medicamentos, etc.)
- ✅ **imagen** - Imagen genérica de Unsplash
- ✅ **beneficiario** - Nombre del beneficiario
- ✅ **destacado** - 3 casos marcados como destacados
- ✅ **coordenadas** - Latitud y longitud para mostrar en mapa
- ✅ **distancia** - Distancia simulada en kilómetros
- ✅ **fecha** - Timestamp de creación

## 🚀 Cómo Usar el Script

### Ejecutar el script:
```bash
node scripts/crearCasosEjemplo.js
```

### Para crear más casos:
1. Edita el archivo `scripts/crearCasosEjemplo.js`
2. Agrega más objetos al array `casosEjemplo`
3. Ejecuta el script nuevamente

## 📱 Ver los Casos en la App

1. **Inicia la app:**
   ```bash
   npm start
   ```

2. **En la app:**
   - Ve a la pantalla de **Inicio** - verás los casos destacados
   - Ve a **Explorar** - verás todos los casos en el mapa
   - Usa **Pull-to-refresh** para recargar los datos

3. **Pantallas que mostrarán los casos:**
   - 🏠 **Inicio** - Casos destacados, cercanos y todos
   - 🗺️ **Explorar** - Mapa con marcadores y vista de lista
   - 🔍 **Búsqueda** - Podrás buscar por ubicación o tipo
   - 📄 **Detalle** - Al tocar cualquier caso

## 🎨 Personalizar los Casos

### Cambiar la imagen:
Edita la variable `IMAGEN_GENERICA` en el script:
```javascript
const IMAGEN_GENERICA = 'https://tu-url-de-imagen.com/imagen.jpg';
```

### Agregar más información:
Puedes agregar campos adicionales a cada caso:
```javascript
{
  nombre: 'Tu caso',
  descripcion: 'Descripción',
  // ... otros campos
  imagenes: ['url1', 'url2', 'url3'], // Array de imágenes
  intermediario: 'Nombre del intermediario', // Opcional
  // Cualquier otro campo que necesites
}
```

## 🗑️ Eliminar los Casos de Prueba

Si quieres eliminar estos casos, puedes hacerlo desde:
1. **Firebase Console** → Firestore → Colección `casos` → Eliminar documentos
2. O crear un script similar que elimine los casos por ID

## 📊 Estructura de los Datos

Los casos creados siguen exactamente la estructura que tu app espera:

```typescript
{
  nombre: string,           // Título del caso
  descripcion: string,      // Descripción corta
  infoAdicional: string,    // Información detallada
  ubicacion: string,        // Ubicación
  prioridad: 'Alta' | 'Media' | 'Baja',
  estado: 'Activo' | 'En proceso' | 'Completado',
  peticion: string,         // Tipo de ayuda
  imagen: string,           // URL de imagen
  beneficiario: string,     // Nombre del beneficiario
  destacado: boolean,       // Si es destacado
  coordenadas: {
    latitud: number,
    longitud: number
  },
  distancia: number,        // En kilómetros
  fecha: string             // ISO 8601 timestamp
}
```

## 💡 Tips

- Los casos con **prioridad "Alta"** y **destacado: true** aparecerán primero
- Las **coordenadas** son de diferentes zonas de Ciudad de México
- Las **distancias** son simuladas (entre 2-8 km)
- Algunos casos tienen **mensajes de agradecimiento** en subcolección

## 🔧 Troubleshooting

**Si el script falla:**

1. **Error de permisos:**
   - Revisa las reglas de Firestore
   - Asegúrate de que permiten escritura

2. **Error de conexión:**
   - Verifica tu archivo `.env`
   - Confirma que las credenciales sean correctas

3. **Error de Firebase:**
   - Asegúrate de tener `firebase` instalado: `npm install firebase`
   - Verifica que dotenv esté instalado: `npm install dotenv`

**Para ver errores detallados:**
```bash
node scripts/crearCasosEjemplo.js --verbose
```

## ✨ Próximos Pasos

Ahora que tienes casos de ejemplo, puedes:
1. ✅ Probar la funcionalidad de búsqueda
2. ✅ Ver cómo se muestran en el mapa
3. ✅ Probar pull-to-refresh
4. ✅ Navegar a los detalles de cada caso
5. ✅ Crear funcionalidad de donaciones

¡Disfruta explorando los casos en tu app! 🎉
