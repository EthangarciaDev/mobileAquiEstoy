import { CasoCard } from '@/components/casos/caso-card';
import { theme } from '@/constants/theme';
import { Caso } from '@/types';
import { obtenerCasosActivos, obtenerCasosDestacados } from '@/utils/casosService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [casos, setCasos] = useState<Caso[]>([]);
  const [casosDestacados, setCasosDestacados] = useState<Caso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    cargarCasos();
  }, []);

  const cargarCasos = async () => {
    setCargando(true);
    const [todosLosCasos, destacados] = await Promise.all([
      obtenerCasosActivos(),
      obtenerCasosDestacados(3),
    ]);
    setCasos(todosLosCasos);
    setCasosDestacados(destacados);
    setCargando(false);
  };

  const handleRefresh = async () => {
    setRefrescando(true);
    await cargarCasos();
    setRefrescando(false);
  };

  const casosCercanos = casos.filter((caso) => caso.distancia && caso.distancia < 5);

  const handleCasoPress = (casoId: string) => {
    router.push(`/caso-detalle?id=${casoId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.subtitle}>¿A quién ayudamos hoy?</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notificaciones')}
          >
            <Ionicons name="notifications" size={24} color={theme.colors.primary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/busqueda')}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Buscar casos por ubicación o tipo...</Text>
          <Ionicons name="options-outline" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={handleRefresh} />
        }
      >
        {cargando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Cargando casos...</Text>
          </View>
        ) : (
          <>
        {/* Accesos Rápidos */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/busqueda')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="location" size={24} color="#2196F3" />
            </View>
            <Text style={styles.quickActionLabel}>Casos Cercanos</Text>
            <Text style={styles.quickActionCount}>{casosCercanos.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/historial-donaciones')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="heart" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.quickActionLabel}>Mis Donaciones</Text>
            <Text style={styles.quickActionCount}>5</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/mi-impacto')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="stats-chart" size={24} color="#FF9800" />
            </View>
            <Text style={styles.quickActionLabel}>Mi Impacto</Text>
            <Text style={styles.quickActionCount}>12</Text>
          </TouchableOpacity>
        </View>

        {/* Casos Destacados */}
        {casosDestacados.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="star" size={20} color={theme.colors.warning} />
                <Text style={styles.sectionTitle}>Casos Destacados</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/busqueda')}>
                <Text style={styles.sectionLink}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {casosDestacados.map((caso) => (
              <CasoCard key={caso.id} caso={caso} onPress={() => handleCasoPress(caso.id)} />
            ))}
          </View>
        )}

        {/* Casos Cercanos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Casos Cerca de Ti</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/busqueda')}>
              <Text style={styles.sectionLink}>Ver mapa</Text>
            </TouchableOpacity>
          </View>
          {casosCercanos.slice(0, 3).map((caso) => (
            <CasoCard key={caso.id} caso={caso} onPress={() => handleCasoPress(caso.id)} />
          ))}
        </View>

        {/* Todos los casos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="list" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.sectionTitle}>Todos los Casos</Text>
            </View>
          </View>
          {casos
            .filter((caso) => 
              !casosDestacados.some(c => c.id === caso.id) && 
              !casosCercanos.some(c => c.id === caso.id)
            )
            .map((caso) => (
              <CasoCard key={caso.id} caso={caso} onPress={() => handleCasoPress(caso.id)} />
            ))}
        </View>

        <View style={styles.bottomSpacing} />
        </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 5,
    ...theme.shadows.small,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 8,
  },
  sectionLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
