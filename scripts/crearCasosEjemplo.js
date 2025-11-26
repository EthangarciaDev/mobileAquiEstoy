// scripts/crearCasosEjemplo.js
// Script para crear casos de ejemplo en Firestore
// Ejecutar con: node scripts/crearCasosEjemplo.js

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, setDoc, doc } = require('firebase/firestore');

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Imagen genérica para todos los casos
const IMAGEN_GENERICA = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80';

// Casos de ejemplo en Puebla, México
const casosEjemplo = [
  {
    nombre: 'Apoyo alimentario para familia en Angelópolis',
    descripcion: 'Familia de 5 personas necesita despensa básica urgente',
    infoAdicional: 'Familia en situación vulnerable en la zona de Angelópolis. El padre perdió su trabajo en la industria automotriz y necesitan apoyo con alimentos básicos: arroz, frijol, aceite, pasta, atún, leche y productos de limpieza. Tienen 3 niños en edad escolar.',
    ubicacion: 'Angelópolis, Puebla',
    prioridad: 'Alta',
    estado: 'Activo',
    peticion: 'Alimentos y despensa básica',
    imagen: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    beneficiario: 'Familia Martínez Rivera',
    destacado: true,
    coordenadas: {
      latitud: 19.0155,
      longitud: -98.2636
    },
    distancia: 2.8,
    fecha: new Date().toISOString(),
  },

// Función para crear los casos
async function crearCasos() {
  console.log('🚀 Iniciando creación de casos de ejemplo...\n');

  try {
    const casosRef = collection(db, 'casos');
    const casosCreados = [];

    for (let i = 0; i < casosEjemplo.length; i++) {
      const caso = casosEjemplo[i];
      console.log(`📝 Creando caso ${i + 1}/${casosEjemplo.length}: "${caso.nombre}"...`);

      // Crear el documento del caso
      const docRef = await addDoc(casosRef, caso);
      casosCreados.push(docRef.id);

      console.log(`   ✅ Caso creado con ID: ${docRef.id}`);

      // Agregar mensaje de agradecimiento de ejemplo (opcional)
      if (Math.random() > 0.5) {
        const mensajeRef = collection(db, 'casos', docRef.id, 'mensaje_agradecimiento');
        await addDoc(mensajeRef, {
          donador: 'Ejemplo de donador',
          mensaje: '¡Muchas gracias por tu generosidad! Tu ayuda hace la diferencia.',
        });
        console.log(`   💌 Mensaje de agradecimiento agregado`);
      }

      console.log('');
    }

    console.log('🎉 ¡Todos los casos fueron creados exitosamente!\n');
    console.log('📋 IDs de los casos creados:');
    casosCreados.forEach((id, index) => {
      console.log(`   ${index + 1}. ${id}`);
    });

    console.log('\n✨ Ahora puedes ver estos casos en tu app.');
    console.log('💡 Tip: Usa pull-to-refresh en la app para recargar los datos.\n');

  } catch (error) {
    console.error('❌ Error al crear los casos:', error);
    console.error('\n💡 Posibles soluciones:');
    console.error('   - Verifica que el archivo .env tenga las credenciales correctas');
    console.error('   - Asegúrate de que las reglas de Firestore permitan escritura');
    console.error('   - Revisa que el proyecto de Firebase esté configurado correctamente\n');
  }

  process.exit(0);
}

// Ejecutar el script
console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('   📱 Script de Creación de Casos - Aquí Estoy');
console.log('   📍 Ubicación: Puebla, México');
console.log('═══════════════════════════════════════════════════════');
console.log('');

crearCasos();
