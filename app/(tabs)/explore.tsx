import { theme } from '@/constants/theme';
import { Caso } from '@/types';
import { obtenerCasosActivos } from '@/utils/casosService';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapaScreen() {
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null);
  const [vistaLista, setVistaLista] = useState(false);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView>(null);

  // Cargar casos y obtener ubicación del usuario
  useEffect(() => {
    obtenerUbicacionUsuario();
    cargarCasos();
  }, []);

  const obtenerUbicacionUsuario = async () => {
    try {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso de ubicación',
          'Necesitamos acceso a tu ubicación para mostrarte los casos cercanos',
          [{ text: 'OK' }]
        );
        return;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUbicacionUsuario(userLocation);

      // Centrar el mapa en la ubicación del usuario
      const newRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setRegion(newRegion);

    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      Alert.alert(
        'Error',
        'No se pudo obtener tu ubicación. Mostrando mapa por defecto.'
      );
    }
  };

  const centrarEnUsuario = () => {
    if (ubicacionUsuario && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: ubicacionUsuario.latitude,
        longitude: ubicacionUsuario.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    } else {
      Alert.alert('Ubicación no disponible', 'No se pudo obtener tu ubicación actual');
    }
  };

  const cargarCasos = async () => {
    setCargando(true);
    const casosData = await obtenerCasosActivos();
    setCasos(casosData);
    setCargando(false);
  };

  // Filtrar casos cercanos (menos de 10 km)
  const casosCercanos = casos.filter((caso) => (caso.distancia || 0) < 10);

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return theme.colors.error;
      case 'media':
        return theme.colors.warning;
      case 'baja':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderCasoCard = (caso: Caso) => (
    <TouchableOpacity
      key={caso.id}
      style={styles.casoCard}
      onPress={() => router.push(`/caso-detallado?id=${caso.id}`)}
    >
      <Image source={{ uri: caso.img }} style={styles.casoImage} />
      <View style={styles.casoInfo}>
        <Text style={styles.casoTitulo} numberOfLines={2}>
          {caso.titulo}
        </Text>
        <View style={styles.casoMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{caso.distancia || 0} km</Text>
          </View>
          <View
            style={[
              styles.prioridadBadge,
              { backgroundColor: `${getPrioridadColor(caso.prioridad)}20` },
            ]}
          >
            <Text
              style={[styles.prioridadText, { color: getPrioridadColor(caso.prioridad) }]}
            >
              {caso.prioridad}
            </Text>
          </View>
        </View>
        <Text style={styles.tipoAyuda} numberOfLines={1}>
          {caso.tipoAyuda}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa de Casos</Text>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setVistaLista(!vistaLista)}
        >
          <Ionicons
            name={vistaLista ? 'map' : 'list'}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Indicador de carga */}
      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando casos...</Text>
        </View>
      ) : /* Vista de Mapa */
      !vistaLista ? (
        <View style={styles.mapContainer}>
          {/* Mapa real con React Native Maps */}
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={false}
          >
            {/* Marcador de ubicación del usuario */}
            {ubicacionUsuario && (
              <Marker
                coordinate={ubicacionUsuario}
                title="Tu ubicación"
                description="Estás aquí"
              >
                <View style={styles.userMarker}>
                  <View style={styles.userMarkerInner} />
                </View>
              </Marker>
            )}

            {/* Marcadores de casos */}
            {casos.map((caso) => {
              if (!caso.coordenadas) return null;
              
              const markerColor =
                caso.prioridad.toLowerCase() === 'alta'
                  ? '#FF3B30'
                  : caso.prioridad.toLowerCase() === 'media'
                  ? '#FF9500'
                  : '#34C759';

              return (
                <Marker
                  key={caso.id}
                  coordinate={{
                    latitude: caso.coordenadas.latitud,
                    longitude: caso.coordenadas.longitud,
                  }}
                  pinColor={markerColor}
                  onPress={() => setCasoSeleccionado(caso)}
                >
                  <View style={styles.customMarker}>
                    <Ionicons name="location" size={40} color={markerColor} />
                  </View>
                </Marker>
              );
            })}
          </MapView>

          {/* Botones de control */}
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={centrarEnUsuario}
            >
              <Ionicons name="locate" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => {
                if (mapRef.current) {
                  mapRef.current.animateToRegion({
                    ...region,
                    latitudeDelta: region.latitudeDelta / 2,
                    longitudeDelta: region.longitudeDelta / 2,
                  }, 300);
                }
              }}
            >
              <Ionicons name="add" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => {
                if (mapRef.current) {
                  mapRef.current.animateToRegion({
                    ...region,
                    latitudeDelta: region.latitudeDelta * 2,
                    longitudeDelta: region.longitudeDelta * 2,
                  }, 300);
                }
              }}
            >
              <Ionicons name="remove" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Card de caso seleccionado */}
          {casoSeleccionado && (
            <View style={styles.selectedCasoCard}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCasoSeleccionado(null)}
              >
                <Ionicons name="close" size={20} color={theme.colors.text} />
              </TouchableOpacity>
              <Image source={{ uri: casoSeleccionado.img }} style={styles.selectedImage} />
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedTitulo}>{casoSeleccionado.titulo}</Text>
                <Text style={styles.selectedUbicacion}>
                  📍 {casoSeleccionado.ubicacion}
                </Text>
                <TouchableOpacity
                  style={styles.verDetalleButton}
                  onPress={() => router.push(`/caso-detallado?id=${casoSeleccionado.id}`)}
                >
                  <Text style={styles.verDetalleText}>Ver detalles</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        /* Vista de Lista */
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.listHeader}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={styles.listHeaderText}>
              {casosCercanos.length} casos cerca de ti
            </Text>
          </View>
          {casosCercanos.map(renderCasoCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  viewToggle: {
    padding: theme.spacing.sm,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControls: {
    position: 'absolute',
    right: theme.spacing.lg,
    top: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  controlButton: {
    backgroundColor: theme.colors.card,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  selectedCasoCard: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.large,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  selectedImage: {
    width: '100%',
    height: 150,
  },
  selectedInfo: {
    padding: theme.spacing.md,
  },
  selectedTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  selectedUbicacion: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  verDetalleButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  verDetalleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: `${theme.colors.primary}10`,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  casoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  casoImage: {
    width: 100,
    height: 100,
  },
  casoInfo: {
    flex: 1,
    padding: theme.spacing.md,
  },
  casoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  casoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  prioridadBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  prioridadText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tipoAyuda: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
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
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(66, 133, 244, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  userMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4285F4',
  },
});
