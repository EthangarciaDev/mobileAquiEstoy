// contexts/AuthContext.tsx
// Contexto global para manejar la autenticación del usuario
import { Usuario } from '@/types';
import { observarEstadoAuth, obtenerDatosUsuario } from '@/utils/firebase';
import { User } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  userData: Usuario | null;
  loading: boolean;
  setUserData: (data: Usuario | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  setUserData: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse a cambios de autenticación
    const unsubscribe = observarEstadoAuth(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Cargar datos del usuario desde Firestore
        const datos = await obtenerDatosUsuario(firebaseUser.uid);
        setUserData(datos);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    // Cleanup al desmontar
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    loading,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
