import { auth } from '@/utils/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔵 AuthProvider: Configurando observador de autenticación...');

    // Suscribirse a cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔵 AuthProvider: Estado de auth cambió');
      console.log('   - Usuario:', currentUser?.email || 'null');
      console.log('   - UID:', currentUser?.uid || 'null');

      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup
    return () => {
      console.log('🔵 AuthProvider: Limpiando observador');
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: user !== null,
  };

  if (loading) {
    console.log('🔵 AuthProvider: Cargando...');
  } else {
    console.log('🔵 AuthProvider: Listo - isAuthenticated:', value.isAuthenticated);
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};