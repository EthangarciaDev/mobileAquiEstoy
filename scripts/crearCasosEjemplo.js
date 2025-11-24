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

// Casos de ejemplo
const casosEjemplo = [
  {
    nombre: 'Apoyo con alimentos para familia numerosa',
    descripcion: 'Familia de 6 personas necesita apoyo con despensa básica',
    infoAdicional: 'Familia con 4 niños pequeños que perdió su fuente de ingreso. Necesitan urgentemente alimentos no perecederos, arroz, frijol, aceite, leche en polvo y productos de higiene básica. El padre está buscando empleo activamente.',
    ubicacion: 'Iztapalapa, Ciudad de México',
    prioridad: 'Alta',
    estado: 'Activo',
    peticion: 'Alimentos y despensa básica',
    imagen: IMAGEN_GENERICA,
    beneficiario: 'Familia González',
    destacado: true,
    coordenadas: {
      latitud: 19.3564,
      longitud: -99.0584
    },
    distancia: 3.5,
    fecha: new Date().toISOString(),
  },
  {
    nombre: 'Donación de ropa de invierno para adulto mayor',
    descripcion: 'Señor de 75 años necesita ropa abrigadora para la temporada de frío',
    infoAdicional: 'Don José vive solo y tiene problemas de movilidad. Necesita cobijas, suéters talla grande, pantalones cómodos y zapatos cerrados número 27. También requiere bastón para caminar.',
    ubicacion: 'Nezahualcóyotl, Estado de México',
    prioridad: 'Media',
    estado: 'Activo',
    peticion: 'Ropa y cobijas',
    imagen: IMAGEN_GENERICA,
    beneficiario: 'Don José Ramírez',
    destacado: false,
    coordenadas: {
      latitud: 19.4006,
      longitud: -99.0145
    },
    distancia: 7.2,
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
  },
  {
    nombre: 'Medicamentos para tratamiento crónico',
    descripcion: 'Paciente diabético necesita insulina y medicamentos para control',
    infoAdicional: 'Persona con diabetes tipo 1 que no puede costear su tratamiento mensual. Requiere insulina glargina, tiras reactivas para medidor de glucosa, y metformina. Tiene receta médica vigente del IMSS.',
    ubicacion: 'Tlalpan, Ciudad de México',
    prioridad: 'Alta',
    estado: 'Activo',
    peticion: 'Medicamentos',
    imagen: IMAGEN_GENERICA,
    beneficiario: 'María Teresa López',
    destacado: true,
    coordenadas: {
      latitud: 19.2837,
      longitud: -99.1661
    },
    distancia: 2.1,
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
  },
  {
    nombre: 'Útiles escolares para estudiante de primaria',
    descripcion: 'Niño de 8 años necesita materiales para continuar sus estudios',
    infoAdicional: 'Estudiante de tercer grado de primaria necesita cuadernos, lápices, colores, mochila y uniformes escolares. Su madre trabaja como empleada doméstica y no puede costear los materiales completos. El niño es muy aplicado y no quiere faltar a clases.',
    ubicacion: 'Gustavo A. Madero, Ciudad de México',
    prioridad: 'Media',
    estado: 'Activo',
    peticion: 'Útiles escolares',
    imagen: IMAGEN_GENERICA,
    beneficiario: 'Carlos Hernández (8 años)',
    destacado: false,
    coordenadas: {
      latitud: 19.4889,
      longitud: -99.1269
    },
    distancia: 5.8,
    fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Hace 3 días
  },
  {
    nombre: 'Silla de ruedas para persona con discapacidad',
    descripcion: 'Joven con discapacidad motriz necesita silla de ruedas',
    infoAdicional: 'Joven de 23 años que sufrió un accidente y quedó con movilidad reducida. Necesita urgentemente una silla de ruedas para poder desplazarse y asistir a sus terapias de rehabilitación. También requiere colchón antiescaras y cojín especializado.',
    ubicacion: 'Coyoacán, Ciudad de México',
    prioridad: 'Alta',
    estado: 'Activo',
    peticion: 'Equipo médico',
    imagen: IMAGEN_GENERICA,
    beneficiario: 'Roberto Sánchez',
    destacado: true,
    coordenadas: {
      latitud: 19.3467,
      longitud: -99.1618
    },
    distancia: 4.3,
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
      console.log(`📝 Creando caso ${i + 1}/5: "${caso.nombre}"...`);

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
console.log('═══════════════════════════════════════════════════════');
console.log('');

crearCasos();
