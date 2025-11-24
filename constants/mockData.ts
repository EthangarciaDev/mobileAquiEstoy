import { Caso, Donacion, Metricas, Notificacion, Usuario } from '@/types';

// Mock de usuario actual
export const mockUsuario: Usuario = {
  id: 'U001',
  nombre: 'Ethan Garcia',
  correo: 'garcia@ejemplo.com',
  telefono: '+52 55 1234 5678',
  ubicacion: 'Puebla',
  fotoPerfil: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  zonaDonacionHabitual: 'Puebla',
  preferenciasNotificacion: {
    nuevoCasos: true,
    actualizacionesDonaciones: true,
    mensajesAgradecimiento: true,
  },
  fechaRegistro: '2025-05-15',
};

// Mock de casos para el feed
export const mockCasosFeed: Caso[] = [
  { 
    id: 'P100', 
    titulo: "Juan tiene hambre (Urgente)", 
    descripcion: "Juan lleva días sin poder comer, él tiene que comer.", 
    descripcionCompleta: "Juan es un niño de 8 años que vive con su abuela en condiciones de extrema pobreza. Lleva varios días sin poder alimentarse adecuadamente. La familia solicita despensa básica con alimentos no perecederos, frutas y verduras. La situación es urgente ya que el pequeño Juan debe mantener sus fuerzas para continuar con sus estudios.",
    img: "https://www.meganoticias.mx/uploads/noticias/charros-entrenara-a-250-ninos-de-escasos-recursos-74418.jpg", 
    imagenes: [
      "https://media.istockphoto.com/id/483691035/es/foto/ni%C3%B1o-de-brasil.jpg?s=612x612&w=0&k=20&c=nf_T3LnIgJKoP9TY2AsVYYeUJqd6zu6FbGKAVzfv8aI=",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80"
    ],
    ubicacion: "Zona Sur, Ciudad de México", 
    coordenadas: { latitud: 19.3027, longitud: -99.1500 },
    distancia: 2.5,
    fecha: "Publicado: 2025-10-01", 
    tipoAyuda: "Alimentos", 
    prioridad: "Alta",
    beneficiario: "Juan Pérez García",
    intermediario: "Centro Comunitario La Esperanza",
    estado: "Activo",
    destacado: true
  },
  { 
    id: 'P101', 
    titulo: "Lupita tiene frío", 
    descripcion: "Lupita lleva varios días sin poder dormir ya que no cuenta con cobijas.", 
    descripcionCompleta: "Lupita es una adulta mayor de 75 años que vive sola en una vivienda sin calefacción. Con la llegada del frío, necesita urgentemente cobijas gruesas, ropa de invierno y un calentador. Su salud es delicada y las bajas temperaturas pueden afectarla gravemente.",
    img: "https://www.movimientoantorchista.org.mx/uploads/images/image_750x422_639dd5a7e3c9a.jpg", 
    imagenes: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-0yiH420M1rzWSJBLtFQP1te-yB5ABAza7g&s",
      
    ],
    ubicacion: "Colonia San Jerónimo, Puebla", 
    coordenadas: { latitud: 19.0414, longitud: -98.2063 },
    distancia: 5.8,
    fecha: "Publicado: 2025-10-01", 
    tipoAyuda: "Cobijas", 
    prioridad: "Media",
    beneficiario: "Lupita Hernández",
    intermediario: "DIF Municipal Puebla",
    estado: "Activo",
    destacado: true
  },
  { 
    id: 'P102', 
    titulo: "Doña Mary te necesita (Comida)", 
    descripcion: "Doña Mary necesita comida para sus hijos.", 
    descripcionCompleta: "Doña Mary es madre soltera de tres hijos menores de edad. Perdió su empleo hace dos meses y está pasando por una situación económica muy difícil. Necesita alimentos no perecederos, leche, huevo y productos de primera necesidad para alimentar a sus pequeños.",
    img: "https://media.istockphoto.com/id/1477655254/es/foto/madre-e-hijos-frente-a-la-casa.jpg?s=612x612&w=0&k=20&c=d-ad5Fxe-2f3AEO3h67tnG9KMcbwaJfKrjzeNmKCWYc=", 
    imagenes: [
      "https://media.istockphoto.com/id/1477655254/es/foto/madre-e-hijos-frente-a-la-casa.jpg?s=612x612&w=0&k=20&c=d-ad5Fxe-2f3AEO3h67tnG9KMcbwaJfKrjzeNmKCWYc=",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
    ],
    ubicacion: "Coacalco, Estado de México", 
    coordenadas: { latitud: 19.6369, longitud: -99.0981 },
    distancia: 12.3,
    fecha: "Publicado: 2025-10-02", 
    tipoAyuda: "Alimentos no perecederos", 
    prioridad: "Alta",
    beneficiario: "María del Carmen López",
    estado: "Activo",
    destacado: false
  },
  { 
    id: 'P103', 
    titulo: "Sra. Dolores ocupa medicina", 
    descripcion: "La señora Dolores ocupa medicamentos ya que lleva varios días enferma.", 
    descripcionCompleta: "La señora Dolores padece diabetes e hipertensión. Debido a su situación económica, no ha podido comprar sus medicamentos de control desde hace tres semanas. Su estado de salud se está deteriorando y requiere con urgencia: Metformina, Losartán y tiras reactivas para medir glucosa.",
    img: "https://media.istockphoto.com/id/182889335/es/foto/uros-mujer-en-la-isla-flotante.jpg?s=612x612&w=0&k=20&c=7BRUJ-f5EUwe4wgalnFV1d2XU1r535Ciy0Vjf77yaE8=", 
    imagenes: [
      "https://media.istockphoto.com/id/182889335/es/foto/uros-mujer-en-la-isla-flotante.jpg?s=612x612&w=0&k=20&c=7BRUJ-f5EUwe4wgalnFV1d2XU1r535Ciy0Vjf77yaE8=",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"
    ],
    ubicacion: "Zapopan, Jalisco", 
    coordenadas: { latitud: 20.7214, longitud: -103.3918 },
    distancia: 3.1,
    fecha: "Publicado: 2025-10-02", 
    tipoAyuda: "Medicamentos", 
    prioridad: "Alta",
    beneficiario: "Dolores Ramírez Sánchez",
    intermediario: "Cruz Roja Zapopan",
    estado: "Activo",
    destacado: true
  },
  { 
    id: 'P104', 
    titulo: "Petición de Víveres para Juan", 
    descripcion: "Juan lleva días sin poder comer, él tiene que comer.", 
    descripcionCompleta: "Familia de cuatro integrantes en situación de vulnerabilidad. El padre perdió su empleo y necesitan apoyo alimentario mientras consiguen ingresos. Solicitan despensa básica.",
    img: "https://media.istockphoto.com/id/483691035/es/foto/ni%C3%B1o-de-brasil.jpg?s=612x612&w=0&k=20&c=nf_T3LnIgJKoP9TY2AsVYYeUJqd6zu6FbGKAVzfv8aI=", 
    ubicacion: "Ecatepec, Estado de México", 
    coordenadas: { latitud: 19.6014, longitud: -99.0360 },
    distancia: 8.7,
    fecha: "Publicado: 2025-10-03", 
    tipoAyuda: "Alimentos", 
    prioridad: "Media",
    beneficiario: "Familia Martínez",
    estado: "Activo",
    destacado: false
  },
  { 
    id: 'P105', 
    titulo: "Cobijas para Lupita", 
    descripcion: "Lupita lleva varios días sin poder dormir ya que no cuenta con cobijas.", 
    ubicacion: "Tlalpan, Ciudad de México", 
    coordenadas: { latitud: 19.2864, longitud: -99.1679 },
    distancia: 6.2,
    img: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=60", 
    fecha: "Publicado: 2025-10-03", 
    tipoAyuda: "Cobijas y ropa", 
    prioridad: "Media",
    beneficiario: "Lupita Flores",
    estado: "Activo",
    destacado: false
  },
  { 
    id: 'P106', 
    titulo: "Alimento para los hijos de Mary", 
    descripcion: "Doña Mary necesita comida para sus hijos.", 
    img: "https://media.istockphoto.com/id/1477655254/es/foto/madre-e-hijos-frente-a-la-casa.jpg?s=612x612&w=0&k=20&c=d-ad5Fxe-2f3AEO3h67tnG9KMcbwaJfKrjzeNmKCWYc=", 
    ubicacion: "Monterrey, Nuevo León", 
    coordenadas: { latitud: 25.6866, longitud: -100.3161 },
    distancia: 15.4,
    fecha: "Publicado: 2025-10-04", 
    tipoAyuda: "Alimentos", 
    prioridad: "Alta",
    beneficiario: "Mary Gutiérrez",
    estado: "Activo",
    destacado: false
  },
  { 
    id: 'P107', 
    titulo: "Medicinas para Sra. Dolores", 
    descripcion: "La señora Dolores ocupa medicamentos ya que lleva varios días enferma.", 
    img: "https://media.istockphoto.com/id/182889335/es/foto/uros-mujer-en-la-isla-flotante.jpg?s=612x612&w=0&k=20&c=7BRUJ-f5EUwe4wgalnFV1d2XU1r535Ciy0Vjf77yaE8=", 
    ubicacion: "Guadalajara, Jalisco", 
    coordenadas: { latitud: 20.6597, longitud: -103.3496 },
    distancia: 4.9,
    fecha: "Publicado: 2025-10-04", 
    tipoAyuda: "Medicamentos", 
    prioridad: "Media",
    beneficiario: "Dolores Castro",
    estado: "Activo",
    destacado: false
  },
];

// Mock de historial de donaciones
export const mockHistorialDonaciones: Donacion[] = [
  { 
    id: 'D001',
    casoId: 'P101',
    casoTitulo: 'Ayuda para Lupita (frío)',
    donadorId: 'U001',
    fecha: '2025-10-20',
    tipoAyuda: 'Cobijas y ropa de invierno',
    cantidad: '3 cobijas térmicas, 1 suéter',
    metodaEntrega: 'Personal',
    estado: 'Entregada',
    evidenciaEntrega: [
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800&q=80'
    ],
    mensajeAgradecimiento: 'Muchas gracias por tu apoyo. Las cobijas me han ayudado mucho en estas noches frías. Dios te bendiga. - Lupita',
    ubicacionEntrega: 'Colonia San Jerónimo, Puebla'
  },
  { 
    id: 'D002',
    casoId: 'P102',
    casoTitulo: 'Comida para Doña Mary',
    donadorId: 'U001',
    fecha: '2025-09-15',
    tipoAyuda: 'Alimentos no perecederos',
    cantidad: 'Despensa básica (20 kg)',
    metodaEntrega: 'Intermediario',
    estado: 'Recibida',
    evidenciaEntrega: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80'
    ],
    mensajeAgradecimiento: 'Gracias de corazón por pensar en mis hijos. Esta ayuda llegó en el momento perfecto. - Mary',
    ubicacionEntrega: 'Coacalco, Estado de México'
  },
  { 
    id: 'D003',
    casoId: 'P103',
    casoTitulo: 'Medicamentos para Dolores',
    donadorId: 'U001',
    fecha: '2025-08-01',
    tipoAyuda: 'Medicamentos',
    cantidad: 'Metformina 30 tabletas, Losartán 30 tabletas',
    metodaEntrega: 'Personal',
    estado: 'Recibida',
    evidenciaEntrega: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'
    ],
    mensajeAgradecimiento: 'Que Dios te colme de bendiciones. Ya me siento mejor gracias a las medicinas. - Dolores',
    ubicacionEntrega: 'Zapopan, Jalisco'
  },
  { 
    id: 'D004',
    casoId: 'P100',
    casoTitulo: 'Apoyo a Juan (hambre)',
    donadorId: 'U001',
    fecha: '2025-07-12',
    tipoAyuda: 'Alimentos',
    cantidad: 'Despensa completa con frutas y verduras',
    metodaEntrega: 'Intermediario',
    estado: 'Recibida',
    mensajeAgradecimiento: 'Juan está muy feliz y agradecido. Ya puede comer bien. Muchas gracias. - Abuela de Juan',
    ubicacionEntrega: 'Zona Sur, Ciudad de México'
  },
  { 
    id: 'D005',
    casoId: 'P105',
    casoTitulo: 'Cobijas para familia vulnerbale',
    donadorId: 'U001',
    fecha: '2025-06-20',
    tipoAyuda: 'Cobijas',
    cantidad: '4 cobijas',
    metodaEntrega: 'Personal',
    estado: 'En camino',
    ubicacionEntrega: 'Tlalpan, Ciudad de México'
  },
];

// Mock de notificaciones
export const mockNotificaciones: Notificacion[] = [
  {
    id: 'N001',
    tipo: 'nuevo_caso',
    titulo: 'Nuevo caso cerca de ti',
    mensaje: 'Se ha publicado un nuevo caso de ayuda a 2.5 km de tu ubicación: "Juan tiene hambre (Urgente)"',
    fecha: '2025-11-10T08:30:00',
    leida: false,
    casoId: 'P100'
  },
  {
    id: 'N002',
    tipo: 'actualizacion_donacion',
    titulo: 'Tu donación fue entregada',
    mensaje: 'La donación de cobijas para Lupita ha sido entregada exitosamente',
    fecha: '2025-11-09T14:20:00',
    leida: false,
    donacionId: 'D001'
  },
  {
    id: 'N003',
    tipo: 'agradecimiento',
    titulo: 'Mensaje de agradecimiento',
    mensaje: 'Lupita te ha enviado un mensaje de agradecimiento por tu ayuda',
    fecha: '2025-11-09T15:00:00',
    leida: true,
    donacionId: 'D001'
  },
  {
    id: 'N004',
    tipo: 'nuevo_caso',
    titulo: '3 nuevos casos en tu zona',
    mensaje: 'Se han publicado 3 nuevos casos de ayuda en Zona Centro y Sur de CDMX',
    fecha: '2025-11-08T10:00:00',
    leida: true
  },
  {
    id: 'N005',
    tipo: 'recordatorio',
    titulo: 'Casos pendientes cerca de ti',
    mensaje: 'Hay 5 casos de ayuda urgente cerca de tu ubicación que necesitan apoyo',
    fecha: '2025-11-07T09:00:00',
    leida: true
  },
  {
    id: 'N006',
    tipo: 'agradecimiento',
    titulo: 'Nuevo mensaje de Doña Mary',
    mensaje: 'Doña Mary te agradece por la despensa que le ayudó a alimentar a sus hijos',
    fecha: '2025-11-06T16:30:00',
    leida: true,
    donacionId: 'D002'
  }
];

// Mock de métricas de impacto
export const mockMetricas: Metricas = {
  casosApoyados: 12,
  totalDonaciones: 18,
  mensajesAgradecimiento: 15,
  tiposAyudaBrindada: [
    { tipo: 'Alimentos', cantidad: 8 },
    { tipo: 'Cobijas y ropa', cantidad: 5 },
    { tipo: 'Medicamentos', cantidad: 3 },
    { tipo: 'Útiles escolares', cantidad: 2 }
  ],
  ultimasDonaciones: mockHistorialDonaciones.slice(0, 3)
};

// Constantes de la app
export const LOGO_URL = 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/ed81ccfc98a246331292256fa82da90d';

export const SOCIAL_ICONS = {
  facebook: 'https://img.icons8.com/ios-filled/24/000000/facebook-new.png',
  instagram: 'https://img.icons8.com/ios-filled/24/000000/instagram-new.png',
  twitter: 'https://img.icons8.com/ios-filled/24/000000/twitter.png',
};

export const CONTACT_EMAIL = 'contacto@ejemplo.com';
