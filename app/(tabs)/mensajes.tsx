import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';

interface Conversacion {
  id: string;
  casoId: string;
  casoTitulo: string;
  contacto: string;
  avatar: string;
  ultimoMensaje: string;
  fechaUltimoMensaje: string;
  noLeidos: number;
  tipo: 'beneficiario' | 'intermediario' | 'donador';
}

const mockConversaciones: Conversacion[] = [
  {
    id: '1',
    casoId: '1',
    casoTitulo: 'Familia necesita alimentos urgentes',
    contacto: 'María López',
    avatar: 'https://i.pravatar.cc/150?img=1',
    ultimoMensaje: 'Muchas gracias por tu ayuda, nos podremos en contacto pronto',
    fechaUltimoMensaje: 'Hace 5 min',
    noLeidos: 2,
    tipo: 'beneficiario',
  },
  {
    id: '2',
    casoId: '3',
    casoTitulo: 'Niños requieren útiles escolares',
    contacto: 'Centro Comunitario La Esperanza',
    avatar: 'https://i.pravatar.cc/150?img=2',
    ultimoMensaje: 'Puedes dejar la donación en nuestro centro de 9am a 5pm',
    fechaUltimoMensaje: 'Hace 2 horas',
    noLeidos: 0,
    tipo: 'intermediario',
  },
  {
    id: '3',
    casoId: '5',
    casoTitulo: 'Medicamentos para adulto mayor',
    contacto: 'Pedro García',
    avatar: 'https://i.pravatar.cc/150?img=3',
    ultimoMensaje: '¿A qué hora podríamos coordinar la entrega?',
    fechaUltimoMensaje: 'Ayer',
    noLeidos: 1,
    tipo: 'beneficiario',
  },
  {
    id: '4',
    casoId: '2',
    casoTitulo: 'Cobijas para refugio temporal',
    contacto: 'Ana Martínez',
    avatar: 'https://i.pravatar.cc/150?img=4',
    ultimoMensaje: 'Perfecto, te esperamos mañana',
    fechaUltimoMensaje: 'Hace 2 días',
    noLeidos: 0,
    tipo: 'intermediario',
  },
];

export default function MensajesScreen() {
  const [busqueda, setBusqueda] = useState('');
  const [conversaciones, setConversaciones] = useState(mockConversaciones);

  const conversacionesFiltradas = conversaciones.filter(
    (conv) =>
      conv.contacto.toLowerCase().includes(busqueda.toLowerCase()) ||
      conv.casoTitulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'beneficiario':
        return 'person';
      case 'intermediario':
        return 'business';
      case 'donador':
        return 'heart';
      default:
        return 'chatbubble';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'beneficiario':
        return theme.colors.primary;
      case 'intermediario':
        return theme.colors.warning;
      case 'donador':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderConversacion = ({ item }: { item: Conversacion }) => (
    <TouchableOpacity
      style={styles.conversacionCard}
      onPress={() => {
        // Aquí se abriría la pantalla de chat individual
        console.log('Abrir chat:', item.id);
      }}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.noLeidos > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.noLeidos}</Text>
          </View>
        )}
      </View>

      <View style={styles.conversacionInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.contactoNombre} numberOfLines={1}>
            {item.contacto}
          </Text>
          <Text style={styles.fecha}>{item.fechaUltimoMensaje}</Text>
        </View>

        <View style={styles.casoRow}>
          <Ionicons
            name={getTipoIcon(item.tipo)}
            size={14}
            color={getTipoColor(item.tipo)}
          />
          <Text style={styles.casoTitulo} numberOfLines={1}>
            {item.casoTitulo}
          </Text>
        </View>

        <Text
          style={[
            styles.ultimoMensaje,
            item.noLeidos > 0 && styles.ultimoMensajeNoLeido,
          ]}
          numberOfLines={1}
        >
          {item.ultimoMensaje}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color={theme.colors.textSecondary} />
      <Text style={styles.emptyTitle}>No hay conversaciones</Text>
      <Text style={styles.emptyText}>
        Cuando ayudes en un caso, podrás chatear con los beneficiarios aquí
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensajes</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversaciones..."
          placeholderTextColor={theme.colors.textSecondary}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Conversaciones */}
      <FlatList
        data={conversacionesFiltradas}
        renderItem={renderConversacion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  headerButton: {
    padding: theme.spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  conversacionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversacionInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  fecha: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  casoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  casoTitulo: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  ultimoMensaje: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  ultimoMensajeNoLeido: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
