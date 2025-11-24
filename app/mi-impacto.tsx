import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { mockMetricas } from '@/constants/mockData';

export default function MiImpactoScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Impacto</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Ionicons name="heart-circle" size={80} color={theme.colors.primary} />
        <Text style={styles.heroTitle}>¡Tu ayuda transforma vidas!</Text>
        <Text style={styles.heroSubtitle}>
          Gracias por ser parte de esta comunidad solidaria
        </Text>
      </View>

      {/* Estadísticas Principales */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="people" size={32} color="#2196F3" />
          </View>
          <Text style={styles.statValue}>{mockMetricas.casosApoyados}</Text>
          <Text style={styles.statLabel}>Casos Apoyados</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="gift" size={32} color="#9C27B0" />
          </View>
          <Text style={styles.statValue}>{mockMetricas.totalDonaciones}</Text>
          <Text style={styles.statLabel}>Donaciones Realizadas</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="mail" size={32} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>{mockMetricas.mensajesAgradecimiento}</Text>
          <Text style={styles.statLabel}>Mensajes de Gracias</Text>
        </View>
      </View>

      {/* Tipos de Ayuda Brindada */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos de Ayuda Brindada</Text>
        <View style={styles.card}>
          {mockMetricas.tiposAyudaBrindada.map((tipo, index) => (
            <View key={index} style={styles.tipoRow}>
              <View style={styles.tipoInfo}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                <Text style={styles.tipoNombre}>{tipo.tipo}</Text>
              </View>
              <View style={styles.tipoBadge}>
                <Text style={styles.tipoCantidad}>{tipo.cantidad}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Últimas Donaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimas Donaciones</Text>
        {mockMetricas.ultimasDonaciones.map((donacion) => (
          <View key={donacion.id} style={styles.donacionCard}>
            <View style={styles.donacionHeader}>
              <Ionicons name="gift-outline" size={24} color={theme.colors.primary} />
              <View style={styles.donacionInfo}>
                <Text style={styles.donacionTitulo}>{donacion.casoTitulo}</Text>
                <Text style={styles.donacionFecha}>{donacion.fecha}</Text>
              </View>
              <View style={[styles.estadoBadge, styles[`estado${donacion.estado.replace(' ', '')}`]]}>
                <Text style={styles.estadoText}>{donacion.estado}</Text>
              </View>
            </View>
            <Text style={styles.donacionDetalle}>{donacion.tipoAyuda}</Text>
            {donacion.mensajeAgradecimiento && (
              <View style={styles.mensajeContainer}>
                <Ionicons name="heart" size={16} color={theme.colors.error} />
                <Text style={styles.mensajeText} numberOfLines={2}>
                  {donacion.mensajeAgradecimiento}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Call to Action */}
      <View style={styles.ctaContainer}>
        <Ionicons name="heart-circle-outline" size={48} color={theme.colors.primary} />
        <Text style={styles.ctaTitle}>¡Continúa ayudando!</Text>
        <Text style={styles.ctaText}>
          Hay muchas personas que necesitan tu apoyo
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.ctaButtonText}>Ver Casos Disponibles</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  heroSection: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 15,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    ...theme.shadows.small,
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.small,
  },
  tipoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tipoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tipoNombre: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  tipoBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoCantidad: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  donacionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...theme.shadows.small,
  },
  donacionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  donacionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  donacionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  donacionFecha: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  estadoPendiente: {
    backgroundColor: '#FF9800',
  },
  estadoEncamino: {
    backgroundColor: '#2196F3',
  },
  estadoEntregada: {
    backgroundColor: '#4CAF50',
  },
  estadoRecibida: {
    backgroundColor: '#8BC34A',
  },
  donacionDetalle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 36,
  },
  mensajeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    marginLeft: 36,
  },
  mensajeText: {
    fontSize: 13,
    color: theme.colors.text,
    fontStyle: 'italic',
    marginLeft: 8,
    flex: 1,
  },
  ctaContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 15,
  },
  ctaText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
});
