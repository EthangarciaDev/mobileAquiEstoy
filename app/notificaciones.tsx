import { mockNotificaciones } from '@/constants/mockData';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NotificacionesScreen() {
  const router = useRouter();

  const getIconName = (tipo: string) => {
    switch (tipo) {
      case 'nuevo_caso':
        return 'megaphone';
      case 'actualizacion_donacion':
        return 'sync';
      case 'agradecimiento':
        return 'heart';
      case 'recordatorio':
        return 'time';
      default:
        return 'notifications';
    }
  };

  const getIconColor = (tipo: string) => {
    switch (tipo) {
      case 'nuevo_caso':
        return '#2196F3';
      case 'actualizacion_donacion':
        return '#FF9800';
      case 'agradecimiento':
        return '#E91E63';
      case 'recordatorio':
        return '#9C27B0';
      default:
        return theme.colors.primary;
    }
  };

  const formatFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (horas < 1) return 'Hace unos minutos';
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;
    return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Ionicons name="checkmark-done" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Notificaciones no leídas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuevas</Text>
          {mockNotificaciones
            .filter((notif) => !notif.leida)
            .map((notificacion) => (
              <TouchableOpacity
                key={notificacion.id}
                style={[styles.notificationCard, styles.notificationUnread]}
                onPress={() => {
                  if (notificacion.casoId) {
                    router.push('/caso-detallado');
                  } else if (notificacion.donacionId) {
                    router.push('/historial-donaciones');
                  }
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getIconColor(notificacion.tipo) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getIconName(notificacion.tipo) as any}
                    size={24}
                    color={getIconColor(notificacion.tipo)}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notificacion.titulo}</Text>
                  <Text style={styles.notificationMessage}>{notificacion.mensaje}</Text>
                  <Text style={styles.notificationTime}>
                    {formatFecha(notificacion.fecha)}
                  </Text>
                </View>
                <View style={styles.unreadDot} />
              </TouchableOpacity>
            ))}
        </View>

        {/* Notificaciones leídas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anteriores</Text>
          {mockNotificaciones
            .filter((notif) => notif.leida)
            .map((notificacion) => (
              <TouchableOpacity
                key={notificacion.id}
                style={styles.notificationCard}
                onPress={() => {
                  if (notificacion.casoId) {
                    router.push('/caso-detallado');
                  } else if (notificacion.donacionId) {
                    router.push('/historial-donaciones');
                  }
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getIconColor(notificacion.tipo) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getIconName(notificacion.tipo) as any}
                    size={24}
                    color={getIconColor(notificacion.tipo)}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notificacion.titulo}</Text>
                  <Text style={styles.notificationMessage}>{notificacion.mensaje}</Text>
                  <Text style={styles.notificationTime}>
                    {formatFecha(notificacion.fecha)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        <View style={styles.bottomSpacing} />
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
    flex: 1,
    textAlign: 'center',
  },
  markAllButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...theme.shadows.small,
  },
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
    marginTop: 4,
  },
  bottomSpacing: {
    height: 100,
  },
});
