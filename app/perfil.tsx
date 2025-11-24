import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { mockUsuario } from '@/constants/mockData';

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(mockUsuario.nombre);
  const [telefono, setTelefono] = useState(mockUsuario.telefono);
  const [zonaDonacion, setZonaDonacion] = useState(mockUsuario.zonaDonacionHabitual);
  const [notifNuevosCasos, setNotifNuevosCasos] = useState(
    mockUsuario.preferenciasNotificacion.nuevoCasos
  );
  const [notifActualizaciones, setNotifActualizaciones] = useState(
    mockUsuario.preferenciasNotificacion.actualizacionesDonaciones
  );
  const [notifAgradecimientos, setNotifAgradecimientos] = useState(
    mockUsuario.preferenciasNotificacion.mensajesAgradecimiento
  );

  const handleSave = () => {
    Alert.alert(
      'Cambios Guardados',
      'Tu información de perfil se ha actualizado correctamente',
      [{ text: 'OK', onPress: () => setIsEditing(false) }]
    );
  };

  const handlePhotoChange = () => {
    Alert.alert('Cambiar Foto', 'Selecciona una foto de tu galería o toma una nueva', [
      { text: 'Galería', onPress: () => console.log('Abrir galería') },
      { text: 'Cámara', onPress: () => console.log('Abrir cámara') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header con foto */}
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: mockUsuario.fotoPerfil }}
            style={styles.profilePhoto}
          />
          <TouchableOpacity style={styles.editPhotoButton} onPress={handlePhotoChange}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerName}>{nombre}</Text>
        <Text style={styles.headerEmail}>{mockUsuario.correo}</Text>
        <View style={styles.badge}>
          <Ionicons name="heart" size={16} color="#FFFFFF" />
          <Text style={styles.badgeText}>Donador Activo</Text>
        </View>
      </View>

      {/* Información Personal */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Información Personal</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nombre Completo</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre completo"
              />
            ) : (
              <Text style={styles.value}>{nombre}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <Text style={[styles.value, styles.valueDisabled]}>
              {mockUsuario.correo}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Teléfono</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={telefono}
                onChangeText={setTelefono}
                placeholder="Teléfono"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{telefono}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ubicación</Text>
            <Text style={[styles.value, styles.valueDisabled]}>
              {mockUsuario.ubicacion}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Zona de Donación Habitual</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={zonaDonacion}
                onChangeText={setZonaDonacion}
                placeholder="Zona de donación"
                multiline
              />
            ) : (
              <Text style={styles.value}>{zonaDonacion}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Preferencias de Notificación */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="notifications" size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Notificaciones</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Ionicons name="megaphone-outline" size={20} color={theme.colors.text} />
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Nuevos casos</Text>
                <Text style={styles.switchSubtitle}>
                  Recibe alertas de casos cercanos a ti
                </Text>
              </View>
            </View>
            <Switch
              value={notifNuevosCasos}
              onValueChange={setNotifNuevosCasos}
              trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Ionicons name="sync-outline" size={20} color={theme.colors.text} />
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Actualizaciones de donaciones</Text>
                <Text style={styles.switchSubtitle}>
                  Estado de tus donaciones en tiempo real
                </Text>
              </View>
            </View>
            <Switch
              value={notifActualizaciones}
              onValueChange={setNotifActualizaciones}
              trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Ionicons name="heart-outline" size={20} color={theme.colors.text} />
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Mensajes de agradecimiento</Text>
                <Text style={styles.switchSubtitle}>
                  Recibe mensajes de las personas que ayudaste
                </Text>
              </View>
            </View>
            <Switch
              value={notifAgradecimientos}
              onValueChange={setNotifAgradecimientos}
              trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Botones de Acción */}
      {isEditing ? (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Opciones Adicionales */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/mi-impacto')}
        >
          <Ionicons name="stats-chart" size={24} color={theme.colors.primary} />
          <Text style={styles.menuItemText}>Mi Impacto</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/historial-donaciones')}
        >
          <Ionicons name="time" size={24} color={theme.colors.primary} />
          <Text style={styles.menuItemText}>Historial de Donaciones</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/ajustes')}
        >
          <Ionicons name="settings" size={24} color={theme.colors.primary} />
          <Text style={styles.menuItemText}>Configuración</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemDanger]}
          onPress={() => {
            Alert.alert(
              'Cerrar Sesión',
              '¿Estás seguro que deseas cerrar sesión?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar Sesión', onPress: () => router.push('/login'), style: 'destructive' },
              ]
            );
          }}
        >
          <Ionicons name="log-out" size={24} color={theme.colors.error} />
          <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
            Cerrar Sesión
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.error} />
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
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerEmail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 15,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 8,
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.small,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
  },
  valueDisabled: {
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    padding: 10,
    borderRadius: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  switchSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...theme.shadows.small,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  menuItemDanger: {
    backgroundColor: '#FEE2E2',
  },
  menuItemTextDanger: {
    color: theme.colors.error,
  },
  bottomSpacing: {
    height: 100,
  },
});
