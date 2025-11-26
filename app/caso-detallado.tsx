import { useAuth } from '@/context/AuthContext';
import { Caso } from '@/types';
import { obtenerCasoPorId } from '@/utils/casosService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function CasoDetalladoScreen() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const params = useLocalSearchParams();
  const [caso, setCaso] = useState<Caso | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    console.log('📄 CasoDetalle mounted');
    console.log('   - authLoading:', authLoading);
    console.log('   - isAuthenticated:', isAuthenticated);
    console.log('   - user:', user?.email || 'null');
    console.log('   - user.uid:', user?.uid || 'null');
    
    cargarCaso();
  }, [params.id]);

  const cargarCaso = async () => {
    if (!params.id || typeof params.id !== 'string') {
      Alert.alert('Error', 'ID de caso inválido');
      router.back();
      return;
    }

    try {
      setLoading(true);
      const casoData = await obtenerCasoPorId(params.id);
      
      if (casoData) {
        setCaso(casoData);
      } else {
        Alert.alert('Error', 'No se encontró el caso');
        router.back();
      }
    } catch (error) {
      console.error('Error al cargar caso:', error);
      Alert.alert('Error', 'No se pudo cargar el caso');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleParticipar = () => {
    console.log('🎯 handleParticipar llamado');
    console.log('   - isAuthenticated:', isAuthenticated);
    console.log('   - user:', user?.email || 'null');
    console.log('   - user.uid:', user?.uid || 'null');
    
    if (!isAuthenticated || !user) {
      console.log('❌ Usuario NO autenticado');
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para participar en casos',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Iniciar sesión', 
            onPress: () => {
              console.log('Navegando a /login');
              router.push('/login');
            }
          }
        ]
      );
      return;
    }

    if (!caso) {
      console.log('❌ No hay caso cargado');
      return;
    }

    console.log('✅ Usuario autenticado, navegando a realizar-donacion');
    console.log('   - Caso ID:', caso.id);
    console.log('   - Usuario ID:', user.uid);
    
    router.push({
      pathname: '/realizar-donacion',
      params: { 
        casoId: caso.id,
        casoTitulo: caso.titulo 
      }
    });
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta':
        return '#ef4444';
      case 'Media':
        return '#f59e0b';
      case 'Baja':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!caso) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontró el caso</Text>
      </View>
    );
  }

  const imagenes = caso.imagenes && caso.imagenes.length > 0 ? caso.imagenes : [caso.img];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Detalle del Caso</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carrusel de imágenes */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {imagenes.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Indicadores de imágenes */}
          {imagenes.length > 1 && (
            <View style={styles.imageIndicators}>
              {imagenes.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === imageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Badge de prioridad */}
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPrioridadColor(caso.prioridad) },
            ]}
          >
            <Text style={styles.priorityText}>{caso.prioridad}</Text>
          </View>
        </View>

        {/* Información del caso */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{caso.titulo}</Text>

          {/* Fecha y ubicación */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{caso.fecha}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{caso.ubicacion}</Text>
            </View>
          </View>

          {/* Tipo de ayuda */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="help-circle-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Tipo de ayuda necesaria</Text>
            </View>
            <Text style={styles.tipoAyuda}>{caso.tipoAyuda}</Text>
          </View>

          {/* Descripción completa */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Descripción detallada</Text>
            </View>
            <Text style={styles.description}>
              {caso.descripcionCompleta || caso.descripcion}
            </Text>
          </View>

          {/* Beneficiario */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Beneficiario</Text>
            </View>
            <Text style={styles.beneficiario}>{caso.beneficiario}</Text>
          </View>

          {/* Intermediario (si existe) */}
          {caso.intermediario && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people-outline" size={20} color="#2563eb" />
                <Text style={styles.sectionTitle}>Intermediario verificado</Text>
              </View>
              <Text style={styles.intermediario}>{caso.intermediario}</Text>
            </View>
          )}

          {/* Estado */}
          <View style={styles.estadoContainer}>
            <View style={styles.estadoBadge}>
              <View
                style={[
                  styles.estadoDot,
                  caso.estado === 'Activo' && styles.estadoDotActivo,
                  caso.estado === 'En proceso' && styles.estadoDotProceso,
                  caso.estado === 'Completado' && styles.estadoDotCompletado,
                ]}
              />
              <Text style={styles.estadoText}>{caso.estado}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón de participar */}
      {caso.estado === 'Activo' && (
        <View style={styles.footer}>
          <Pressable style={styles.participarButton} onPress={handleParticipar}>
            <Ionicons name="hand-right-outline" size={24} color="#fff" />
            <Text style={styles.participarText}>Quiero Ayudar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: width,
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 24,
  },
  priorityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  tipoAyuda: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '500',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
  },
  beneficiario: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
  },
  intermediario: {
    fontSize: 15,
    color: '#059669',
    fontWeight: '500',
  },
  estadoContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  estadoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  estadoDotActivo: {
    backgroundColor: '#10b981',
  },
  estadoDotProceso: {
    backgroundColor: '#f59e0b',
  },
  estadoDotCompletado: {
    backgroundColor: '#6b7280',
  },
  estadoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  participarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  participarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});