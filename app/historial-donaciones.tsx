import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Donacion } from '@/types';
import { obtenerDonacionesUsuario } from '@/utils/donacionesService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HistorialDonacionesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [donacionSeleccionada, setDonacionSeleccionada] = useState<Donacion | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    cargarDonaciones();
  }, [user]);

  const cargarDonaciones = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📦 Cargando donaciones del usuario:', user.uid);
      const donacionesData = await obtenerDonacionesUsuario(user.uid);
      console.log('📦 Donaciones cargadas:', donacionesData.length);
      setDonaciones(donacionesData);
    } catch (error) {
      console.error('Error al cargar donaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefrescando(true);
    await cargarDonaciones();
    setRefrescando(false);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return '#FF9800';
      case 'En camino':
        return '#2196F3';
      case 'Entregada':
        return '#4CAF50';
      case 'Recibida':
        return '#8BC34A';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'time';
      case 'En camino':
        return 'car';
      case 'Entregada':
        return 'checkmark-circle';
      case 'Recibida':
        return 'heart-circle';
      default:
        return 'ellipse';
    }
  };

  const handleVerDetalle = (donacion: any) => {
    setDonacionSeleccionada(donacion);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Donaciones</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Cargando historial...</Text>
          </View>
        ) : donaciones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="gift-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>No hay donaciones</Text>
            <Text style={styles.emptyText}>
              Aún no has realizado ninguna donación. ¡Empieza a ayudar hoy!
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.emptyButtonText}>Explorar casos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Estadísticas */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{donaciones.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {donaciones.filter((d) => d.estado === 'Entregada').length}
                </Text>
                <Text style={styles.statLabel}>Completadas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {donaciones.filter((d) => d.estado === 'Pendiente').length}
                </Text>
                <Text style={styles.statLabel}>Pendientes</Text>
              </View>
            </View>

            {/* Lista de donaciones */}
            <View style={styles.listContainer}>
              {donaciones.map((donacion) => (
            <TouchableOpacity
              key={donacion.id}
              style={styles.donacionCard}
              onPress={() => handleVerDetalle(donacion)}
            >
              <View style={styles.donacionHeader}>
                <View style={styles.donacionTitleContainer}>
                  <Ionicons name="gift" size={24} color={theme.colors.primary} />
                  <View style={styles.donacionTitleText}>
                    <Text style={styles.donacionTitulo}>{donacion.casoTitulo}</Text>
                    <Text style={styles.donacionFecha}>{donacion.fecha}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.estadoBadge,
                    { backgroundColor: getEstadoColor(donacion.estado) },
                  ]}
                >
                  <Ionicons
                    name={getEstadoIcon(donacion.estado) as any}
                    size={14}
                    color="#FFFFFF"
                  />
                  <Text style={styles.estadoText}>{donacion.estado}</Text>
                </View>
              </View>

              <View style={styles.donacionDetalle}>
                <View style={styles.detalleRow}>
                  <Ionicons name="cube-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.detalleText}>{donacion.tipoAyuda}</Text>
                </View>
                <View style={styles.detalleRow}>
                  <Ionicons name="scale-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.detalleText}>{donacion.cantidad}</Text>
                </View>
                <View style={styles.detalleRow}>
                  <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.detalleText}>{donacion.ubicacionEntrega}</Text>
                </View>
              </View>

              {donacion.mensajeAgradecimiento && (
                <View style={styles.mensajePreview}>
                  <Ionicons name="heart" size={16} color={theme.colors.error} />
                  <Text style={styles.mensajePreviewText} numberOfLines={1}>
                    Mensaje de agradecimiento recibido
                  </Text>
                </View>
              )}

              <View style={styles.verMasContainer}>
                <Text style={styles.verMasText}>Ver detalles</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal de Detalle */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle de Donación</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {donacionSeleccionada && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Información General</Text>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Caso:</Text>
                      <Text style={styles.modalValue}>
                        {donacionSeleccionada.casoTitulo}
                      </Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Fecha:</Text>
                      <Text style={styles.modalValue}>{donacionSeleccionada.fecha}</Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Estado:</Text>
                      <View
                        style={[
                          styles.estadoBadge,
                          { backgroundColor: getEstadoColor(donacionSeleccionada.estado) },
                        ]}
                      >
                        <Text style={styles.estadoText}>{donacionSeleccionada.estado}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Detalles de la Ayuda</Text>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Tipo:</Text>
                      <Text style={styles.modalValue}>{donacionSeleccionada.tipoAyuda}</Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Cantidad:</Text>
                      <Text style={styles.modalValue}>{donacionSeleccionada.cantidad}</Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Método:</Text>
                      <Text style={styles.modalValue}>
                        {donacionSeleccionada.metodaEntrega}
                      </Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Ubicación:</Text>
                      <Text style={styles.modalValue}>
                        {donacionSeleccionada.ubicacionEntrega}
                      </Text>
                    </View>
                  </View>

                  {donacionSeleccionada.evidenciaEntrega &&
                    donacionSeleccionada.evidenciaEntrega.length > 0 && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Evidencia de Entrega</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {donacionSeleccionada.evidenciaEntrega.map(
                            (img: string, index: number) => (
                              <Image
                                key={index}
                                source={{ uri: img }}
                                style={styles.evidenciaImage}
                              />
                            )
                          )}
                        </ScrollView>
                      </View>
                    )}

                  {donacionSeleccionada.mensajeAgradecimiento && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Mensaje de Agradecimiento</Text>
                      <View style={styles.mensajeCard}>
                        <Ionicons name="heart" size={24} color={theme.colors.error} />
                        <Text style={styles.mensajeText}>
                          {donacionSeleccionada.mensajeAgradecimiento}
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  donacionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  donacionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  donacionTitleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  donacionTitleText: {
    marginLeft: 12,
    flex: 1,
  },
  donacionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  donacionFecha: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  donacionDetalle: {
    marginBottom: 12,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detalleText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  mensajePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  mensajePreviewText: {
    fontSize: 13,
    color: theme.colors.text,
    fontStyle: 'italic',
    marginLeft: 8,
    flex: 1,
  },
  verMasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  verMasText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  evidenciaImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  mensajeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  mensajeText: {
    fontSize: 14,
    color: theme.colors.text,
    fontStyle: 'italic',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
