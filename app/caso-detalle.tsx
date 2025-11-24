import { CasoDetalle } from '@/components/casos/caso-detalle';
import { theme } from '@/constants/theme';
import { Caso } from '@/types';
import { obtenerCasoPorId } from '@/utils/casosService';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function CasoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [caso, setCaso] = useState<Caso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    cargarCaso();
  }, [id]);

  const cargarCaso = async () => {
    if (!id) {
      setError(true);
      setCargando(false);
      return;
    }

    setCargando(true);
    const casoData = await obtenerCasoPorId(id as string);
    
    if (casoData) {
      setCaso(casoData);
    } else {
      setError(true);
    }
    
    setCargando(false);
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando caso...</Text>
      </View>
    );
  }

  if (error || !caso) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Caso no encontrado</Text>
      </View>
    );
  }

  return <CasoDetalle caso={caso} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    fontWeight: '600',
  },
});
