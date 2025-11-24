// utils/casosService.ts
// Servicio para manejar operaciones con la colección de casos en Firestore
import { Caso } from '@/types';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Estructura del caso en Firestore según las imágenes:
 * - descripcion: string
 * - estado: string
 * - infoAdicional: string
 * - nombre: string
 * - petición: string
 * - prioridad: string
 * - ubicacion: string
 * + mensaje_agradecimiento (subcolecci\u00f3n)
 */

// Mapear documento de Firestore a tipo Caso de la app
const mapFirestoreToCaso = (id: string, data: any): Caso => {
  return {
    id,
    titulo: data.nombre || 'Sin título',
    descripcion: data.descripcion || '',
    descripcionCompleta: data.infoAdicional || data.descripcion || '',
    img: data.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen',
    imagenes: data.imagenes || [],
    ubicacion: data.ubicacion || 'Sin ubicación',
    coordenadas: data.coordenadas || undefined,
    distancia: data.distancia || undefined,
    fecha: data.fecha || new Date().toISOString(),
    tipoAyuda: data.petición || data.peticion || 'Ayuda general',
    prioridad: (data.prioridad || 'Media') as 'Alta' | 'Media' | 'Baja',
    beneficiario: data.beneficiario || 'Beneficiario',
    intermediario: data.intermediario,
    estado: (data.estado || 'Activo') as 'Activo' | 'En proceso' | 'Completado',
    destacado: data.destacado || false,
  };
};

// Obtener todos los casos
export const obtenerTodosCasos = async (): Promise<Caso[]> => {
  try {
    const casosRef = collection(db, 'casos');
    const snapshot = await getDocs(casosRef);
    
    const casos: Caso[] = [];
    snapshot.forEach((doc) => {
      casos.push(mapFirestoreToCaso(doc.id, doc.data()));
    });
    
    return casos;
  } catch (error) {
    console.error('Error al obtener casos:', error);
    return [];
  }
};

// Obtener un caso por ID
export const obtenerCasoPorId = async (id: string): Promise<Caso | null> => {
  try {
    const casoRef = doc(db, 'casos', id);
    const casoSnap = await getDoc(casoRef);
    
    if (casoSnap.exists()) {
      return mapFirestoreToCaso(casoSnap.id, casoSnap.data());
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener caso:', error);
    return null;
  }
};

// Obtener casos activos
export const obtenerCasosActivos = async (): Promise<Caso[]> => {
  try {
    // Intentar primero con query simple sin orderBy
    const casosRef = collection(db, 'casos');
    const q = query(casosRef, where('estado', '==', 'Activo'));
    
    const snapshot = await getDocs(q);
    const casos: Caso[] = [];
    
    snapshot.forEach((doc) => {
      casos.push(mapFirestoreToCaso(doc.id, doc.data()));
    });
    
    // Ordenar en cliente por fecha
    return casos.sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  } catch (error: any) {
    console.error('Error al obtener casos activos:', error);
    
    // Fallback: obtener todos y filtrar en cliente
    try {
      const todosCasos = await obtenerTodosCasos();
      const casosActivos = todosCasos.filter(c => c.estado === 'Activo');
      
      // Ordenar por fecha
      return casosActivos.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
      return [];
    }
  }
};

// Obtener casos por prioridad
export const obtenerCasosPorPrioridad = async (
  prioridad: 'Alta' | 'Media' | 'Baja'
): Promise<Caso[]> => {
  try {
    // Filtrar en cliente para evitar necesidad de índices compuestos
    const casosActivos = await obtenerCasosActivos();
    return casosActivos.filter(caso => caso.prioridad === prioridad);
  } catch (error) {
    console.error('Error al obtener casos por prioridad:', error);
    return [];
  }
};

// Obtener casos destacados
export const obtenerCasosDestacados = async (limite: number = 5): Promise<Caso[]> => {
  try {
    // Obtener todos los casos activos y filtrar destacados en cliente
    const casosActivos = await obtenerCasosActivos();
    const destacados = casosActivos.filter(caso => caso.destacado === true);
    
    // Si hay casos destacados, retornarlos limitados
    if (destacados.length > 0) {
      return destacados.slice(0, limite);
    }
    
    // Si no hay destacados, retornar casos de alta prioridad
    const casosAlta = casosActivos.filter(caso => caso.prioridad === 'Alta');
    return casosAlta.slice(0, limite);
  } catch (error) {
    console.error('Error al obtener casos destacados:', error);
    return [];
  }
};

// Buscar casos por ubicación (búsqueda simple)
export const buscarCasosPorUbicacion = async (ubicacion: string): Promise<Caso[]> => {
  try {
    const casos = await obtenerCasosActivos();
    const termino = ubicacion.toLowerCase();
    
    return casos.filter(caso =>
      caso.ubicacion.toLowerCase().includes(termino)
    );
  } catch (error) {
    console.error('Error al buscar casos por ubicación:', error);
    return [];
  }
};

// Buscar casos por tipo de ayuda
export const buscarCasosPorTipo = async (tipoAyuda: string): Promise<Caso[]> => {
  try {
    const casos = await obtenerCasosActivos();
    const termino = tipoAyuda.toLowerCase();
    
    return casos.filter(caso =>
      caso.tipoAyuda.toLowerCase().includes(termino)
    );
  } catch (error) {
    console.error('Error al buscar casos por tipo:', error);
    return [];
  }
};

// Obtener mensaje de agradecimiento de un caso
export const obtenerMensajeAgradecimiento = async (
  casoId: string
): Promise<string | null> => {
  try {
    const mensajesRef = collection(db, 'casos', casoId, 'mensaje_agradecimiento');
    const snapshot = await getDocs(mensajesRef);
    
    if (!snapshot.empty) {
      const primerDoc = snapshot.docs[0];
      const data = primerDoc.data();
      return data.mensaje || data.donador || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener mensaje de agradecimiento:', error);
    return null;
  }
};

// Búsqueda general (título, descripción, ubicación)
export const buscarCasosGeneral = async (termino: string): Promise<Caso[]> => {
  try {
    const casos = await obtenerCasosActivos();
    const busqueda = termino.toLowerCase();
    
    return casos.filter(caso =>
      caso.titulo.toLowerCase().includes(busqueda) ||
      caso.descripcion.toLowerCase().includes(busqueda) ||
      caso.ubicacion.toLowerCase().includes(busqueda) ||
      caso.tipoAyuda.toLowerCase().includes(busqueda)
    );
  } catch (error) {
    console.error('Error en búsqueda general:', error);
    return [];
  }
};
