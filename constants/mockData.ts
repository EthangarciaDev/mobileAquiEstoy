import { Donacion, Metricas, Notificacion, Usuario } from '@/types';

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
