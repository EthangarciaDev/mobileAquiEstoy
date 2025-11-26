// utils/firebase.ts
// Servicio de Firebase para autenticación y base de datos
import firebaseConfig from '@/constants/firebaseConfig';
import { Usuario } from '@/types';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Registrar nuevo usuario
export const registrarUsuario = async (
  email: string,
  password: string,
  nombre: string,
  telefono: string,
  ubicacion: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil con nombre
    await updateProfile(user, {
      displayName: nombre,
    });

    // Guardar datos adicionales en Firestore
    const usuarioData: Usuario = {
      id: user.uid,
      nombre,
      correo: email,
      telefono,
      ubicacion,
      zonaDonacionHabitual: ubicacion,
      preferenciasNotificacion: {
        nuevoCasos: true,
        actualizacionesDonaciones: true,
        mensajesAgradecimiento: true,
      },
      fechaRegistro: new Date().toISOString(),
    };

    await setDoc(doc(db, 'Usuario', user.uid), usuarioData);

    return { success: true, user };
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    let errorMessage = 'Error al crear la cuenta';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este correo ya está registrado';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico inválido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es muy débil';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
    }

    return { success: false, error: errorMessage };
  }
};

// Iniciar sesión
export const iniciarSesion = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    let errorMessage = 'Error al iniciar sesión';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Correo o contraseña incorrectos';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico inválido';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos. Intenta más tarde';
        break;
    }

    return { success: false, error: errorMessage };
  }
};

// Cerrar sesión
export const cerrarSesion = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: 'Error al cerrar sesión' };
  }
};

// Obtener datos del usuario desde Firestore
export const obtenerDatosUsuario = async (
  uid: string
): Promise<Usuario | null> => {
  try {
    const docRef = doc(db, 'Usuario', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Usuario;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

// Actualizar datos del usuario en Firestore
export const actualizarDatosUsuario = async (
  uid: string,
  datos: Partial<Usuario>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'Usuario', uid);
    
    // Actualizar solo los campos proporcionados
    await setDoc(docRef, datos, { merge: true });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error al actualizar datos del usuario:', error);
    return { success: false, error: 'Error al actualizar los datos' };
  }
};

// Observador de estado de autenticación
export const observarEstadoAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
