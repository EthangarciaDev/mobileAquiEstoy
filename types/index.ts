// Tipos de datos para la aplicación Aquí Estoy

// Usuario Donador
export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  ubicacion: string;
  fotoPerfil?: string;
  zonaDonacionHabitual: string;
  preferenciasNotificacion: {
    nuevoCasos: boolean;
    actualizacionesDonaciones: boolean;
    mensajesAgradecimiento: boolean;
  };
  fechaRegistro: string;
}

// Caso de ayuda
export interface Caso {
  id: string;
  titulo: string;
  descripcion: string;
  descripcionCompleta?: string;
  img: string;
  imagenes?: string[];
  ubicacion: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
  distancia?: number;
  fecha: string;
  tipoAyuda: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  beneficiario: string;
  intermediario?: string;
  estado: 'Activo' | 'En proceso' | 'Completado';
  destacado?: boolean;
}

// Donación realizada
export interface Donacion {
  id: string;
  casoId: string;
  casoTitulo: string;
  donadorId: string;
  fecha: string;
  tipoAyuda: string;
  cantidad: string;
  metodaEntrega: 'Personal' | 'Intermediario';
  estado: 'Pendiente' | 'En camino' | 'Entregada' | 'Recibida';
  evidenciaEntrega?: string[];
  mensajeAgradecimiento?: string;
  ubicacionEntrega?: string;
}

// Notificación
export interface Notificacion {
  id: string;
  tipo: 'nuevo_caso' | 'actualizacion_donacion' | 'agradecimiento' | 'recordatorio';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  casoId?: string;
  donacionId?: string;
}

// Métricas de impacto
export interface Metricas {
  casosApoyados: number;
  totalDonaciones: number;
  mensajesAgradecimiento: number;
  tiposAyudaBrindada: {
    tipo: string;
    cantidad: number;
  }[];
  ultimasDonaciones: Donacion[];
}

// Filtros de búsqueda
export interface FiltrosBusqueda {
  tipoAyuda?: string[];
  ubicacion?: string;
  prioridad?: 'Alta' | 'Media' | 'Baja';
  fechaDesde?: string;
  fechaHasta?: string;
  distanciaMaxima?: number;
}

export interface MenuItem {
  key: string;
  label: string;
}

export type Screen = 
  | 'inicio' 
  | 'login' 
  | 'registro' 
  | 'perfil' 
  | 'MisDonaciones' 
  | 'HistorialDonaciones' 
  | 'contactanos' 
  | 'ajustes'
  | 'CasoDetallado'
  | 'RealizarDonacion'
  | 'Notificaciones'
  | 'Busqueda'
  | 'MiImpacto';
