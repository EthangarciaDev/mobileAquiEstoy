// utils/donacionesService.ts
// Servicio para manejar donaciones en Firestore
import { Donacion } from '@/types';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './firebase';

// Crear una donación y actualizar el caso
export const crearDonacion = async (
  casoId: string,
  donadorId: string,
  donadorNombre: string,
  tipoAyuda: string,
  cantidad: string,
  metodoEntrega: 'Personal' | 'Intermediario'
): Promise<{ success: boolean; donacionId?: string; error?: string }> => {
  try {
    // Obtener información del caso
    const casoRef = doc(db, 'casos', casoId);
    const casoSnap = await getDoc(casoRef);

    if (!casoSnap.exists()) {
      return { success: false, error: 'El caso no existe' };
    }

    const casoData = casoSnap.data();

    // Crear la donación
    const donacionData = {
      casoId,
      casoTitulo: casoData.nombre || 'Sin título',
      casoBeneficiario: casoData.beneficiario || 'Beneficiario',
      casoUbicacion: casoData.ubicacion || 'Sin ubicación',
      casoImagen: casoData.imagen || '',
      donadorId,
      donadorNombre,
      fecha: new Date().toISOString(),
      tipoAyuda,
      cantidad,
      metodaEntrega: metodoEntrega,
      estado: 'Pendiente' as const,
      ubicacionEntrega: casoData.ubicacion || '',
    };

    // Guardar en colección de donaciones
    const donacionRef = await addDoc(collection(db, 'donaciones'), donacionData);

    // Actualizar el estado del caso a "Completado"
    await updateDoc(casoRef, {
      estado: 'Completado',
      donadorId,
      donadorNombre,
      fechaCompletado: new Date().toISOString(),
    });

    // Actualizar métricas del usuario (opcional)
    try {
      const userMetricsRef = doc(db, 'Usuario', donadorId, 'metricas', 'general');
      const metricsSnap = await getDoc(userMetricsRef);

      if (metricsSnap.exists()) {
        await updateDoc(userMetricsRef, {
          casosApoyados: increment(1),
          totalDonaciones: increment(1),
          ultimaActualizacion: new Date().toISOString(),
        });
      } else {
        // Crear métricas si no existen
        await addDoc(collection(db, 'Usuario', donadorId, 'metricas'), {
          casosApoyados: 1,
          totalDonaciones: 1,
          mensajesAgradecimiento: 0,
          tiposAyudaBrindada: [{ tipo: tipoAyuda, cantidad: 1 }],
          ultimaActualizacion: new Date().toISOString(),
        });
      }
    } catch (metricsError) {
      console.log('Error al actualizar métricas (no crítico):', metricsError);
    }

    return { success: true, donacionId: donacionRef.id };
  } catch (error: any) {
    console.error('Error al crear donación:', error);
    let errorMessage = 'Error al registrar la donación';

    switch (error.code) {
      case 'permission-denied':
        errorMessage = 'No tienes permisos para realizar esta acción';
        break;
      case 'network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
    }

    return { success: false, error: errorMessage };
  }
};

// Obtener donaciones de un usuario
export const obtenerDonacionesUsuario = async (
  donadorId: string
): Promise<Donacion[]> => {
  try {
    const donacionesRef = collection(db, 'donaciones');
    const q = query(donacionesRef, where('donadorId', '==', donadorId));

    const snapshot = await getDocs(q);
    const donaciones: Donacion[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      donaciones.push({
        id: doc.id,
        casoId: data.casoId,
        casoTitulo: data.casoTitulo,
        donadorId: data.donadorId,
        fecha: data.fecha,
        tipoAyuda: data.tipoAyuda,
        cantidad: data.cantidad,
        metodaEntrega: data.metodaEntrega,
        estado: data.estado,
        evidenciaEntrega: data.evidenciaEntrega || [],
        mensajeAgradecimiento: data.mensajeAgradecimiento,
        ubicacionEntrega: data.ubicacionEntrega,
      });
    });

    // Ordenar por fecha descendente
    return donaciones.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  } catch (error) {
    console.error('Error al obtener donaciones:', error);
    return [];
  }
};

// Obtener una donación específica
export const obtenerDonacionPorId = async (
  donacionId: string
): Promise<Donacion | null> => {
  try {
    const donacionRef = doc(db, 'donaciones', donacionId);
    const donacionSnap = await getDoc(donacionRef);

    if (donacionSnap.exists()) {
      const data = donacionSnap.data();
      return {
        id: donacionSnap.id,
        casoId: data.casoId,
        casoTitulo: data.casoTitulo,
        donadorId: data.donadorId,
        fecha: data.fecha,
        tipoAyuda: data.tipoAyuda,
        cantidad: data.cantidad,
        metodaEntrega: data.metodaEntrega,
        estado: data.estado,
        evidenciaEntrega: data.evidenciaEntrega || [],
        mensajeAgradecimiento: data.mensajeAgradecimiento,
        ubicacionEntrega: data.ubicacionEntrega,
      };
    }

    return null;
  } catch (error) {
    console.error('Error al obtener donación:', error);
    return null;
  }
};

// Obtener métricas de impacto del usuario
export const obtenerMetricasUsuario = async (userId: string) => {
  try {
    // Obtener todas las donaciones del usuario
    const donaciones = await obtenerDonacionesUsuario(userId);

    // Calcular métricas
    const casosApoyados = donaciones.length;
    const totalDonaciones = donaciones.length;

    // Agrupar por tipo de ayuda
    const tiposAyuda = donaciones.reduce((acc, donacion) => {
      const tipo = donacion.tipoAyuda;
      const existing = acc.find((t) => t.tipo === tipo);
      if (existing) {
        existing.cantidad++;
      } else {
        acc.push({ tipo, cantidad: 1 });
      }
      return acc;
    }, [] as { tipo: string; cantidad: number }[]);

    return {
      casosApoyados,
      totalDonaciones,
      mensajesAgradecimiento: 0, // Por implementar
      tiposAyudaBrindada: tiposAyuda,
      ultimasDonaciones: donaciones.slice(0, 5),
    };
  } catch (error) {
    console.error('Error al obtener métricas:', error);
    return {
      casosApoyados: 0,
      totalDonaciones: 0,
      mensajesAgradecimiento: 0,
      tiposAyudaBrindada: [],
      ultimasDonaciones: [],
    };
  }
};

// Verificar si un usuario ya donó a un caso específico
export const usuarioYaDono = async (
  casoId: string,
  donadorId: string
): Promise<boolean> => {
  try {
    const donacionesRef = collection(db, 'donaciones');
    const q = query(
      donacionesRef,
      where('casoId', '==', casoId),
      where('donadorId', '==', donadorId)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error al verificar donación:', error);
    return false;
  }
};
