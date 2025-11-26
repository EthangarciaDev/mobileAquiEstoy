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
  {
    nombre: 'Cobijas para el frío en San Pedro Cholula',
    descripcion: 'Adultos mayores necesitan cobijas para enfrentar el invierno',
    infoAdicional: 'Casa hogar con 8 adultos mayores en San Pedro Cholula necesita cobijas térmicas, colchas gruesas y ropa de invierno. Las temperaturas bajan mucho en la temporada y no cuentan con calefacción. También necesitan pijamas abrigadoras.',
    ubicacion: 'San Pedro Cholula, Puebla',
    prioridad: 'Alta',
    estado: 'Activo',
    peticion: 'Cobijas y ropa de invierno',
    imagen: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
    beneficiario: 'Casa Hogar Santa María',
    destacado: true,
    coordenadas: {
      latitud: 19.0639,
      longitud: -98.3030
    },
    distancia: 8.5,
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    nombre: 'Medicamentos para tratamiento respiratorio',
    descripcion: 'Niña con asma necesita medicamentos para su tratamiento',
    infoAdicional: 'Niña de 7 años en la colonia La Paz con asma crónica. Requiere inhaladores (salbutamol y beclometasona), nebulizador y medicamentos para control. Su familia no puede costear el tratamiento completo. Tiene receta del Hospital del Niño Poblano.',
    ubicacion: 'Colonia La Paz, Puebla Centro',
    prioridad: 'Alta',
    estado: 'Activo',
    peticion: 'Medicamentos',
    imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    beneficiario: 'Sofía Ramírez Flores',
    destacado: false,
    coordenadas: {
      latitud: 19.0414,
      longitud: -98.2063
    },
    distancia: 3.2,
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    nombre: 'Útiles escolares en Tehuacán',
    descripcion: 'Estudiantes de primaria necesitan materiales escolares',
    infoAdicional: 'Escuela primaria en comunidad rural de Tehuacán con 15 estudiantes que no tienen recursos para útiles escolares. Necesitan cuadernos, lápices, colores, tijeras, pegamento, mochilas y uniformes. Los niños quieren seguir estudiando.',
    ubicacion: 'Tehuacán, Puebla',
    prioridad: 'Media',
    estado: 'Activo',
    peticion: 'Útiles escolares',
    imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    beneficiario: 'Escuela Primaria Benito Juárez',
    destacado: false,
    coordenadas: {
      latitud: 18.4631,
      longitud: -97.3931
    },
    distancia: 120.5,
    fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    nombre: 'Silla de ruedas en Cuautlancingo',
    descripcion: 'Persona con discapacidad requiere silla de ruedas',
    infoAdicional: 'Joven de 28 años con parálisis cerebral que vive en Cuautlancingo. Su silla de ruedas se descompuso y no puede movilizarse. Necesita silla de ruedas resistente, preferiblemente con reposapiés ajustables. Asiste a terapias de rehabilitación 3 veces por semana.',
    ubicacion: 'Cuautlancingo, Puebla',
    prioridad: 'Alta',
    estado: 'Activo',
    peticion: 'Equipo médico',
    imagen: 'https://images.unsplash.com/photo-1576765608622-067973a79f53?w=800&q=80',
    beneficiario: 'Luis Alberto Pérez',
    destacado: true,
    coordenadas: {
      latitud: 19.0589,
      longitud: -98.1836
    },
    distancia: 5.4,
    fecha: new Date().toISOString(),
  },
];

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
