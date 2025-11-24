import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { mockCasosFeed } from '@/constants/mockData';
import { CasoCard } from '@/components/casos/caso-card';

const TIPOS_AYUDA = [
  'Todos',
  'Alimentos',
  'Cobijas y ropa',
  'Medicamentos',
  'Útiles escolares',
  'Otros',
];

const PRIORIDADES = ['Todas', 'Alta', 'Media', 'Baja'];

export default function BusquedaScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [tipoAyudaSeleccionado, setTipoAyudaSeleccionado] = useState('Todos');
  const [prioridadSeleccionada, setPrioridadSeleccionada] = useState('Todas');
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'mapa'>('lista');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const casosFiltrados = mockCasosFeed.filter((caso) => {
    const coincideBusqueda =
      busqueda === '' ||
      caso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      caso.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
      caso.tipoAyuda.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo =
      tipoAyudaSeleccionado === 'Todos' || caso.tipoAyuda.includes(tipoAyudaSeleccionado);

    const coincidePrioridad =
      prioridadSeleccionada === 'Todas' || caso.prioridad === prioridadSeleccionada;

    return coincideBusqueda && coincideTipo && coincidePrioridad;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Casos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título, ubicación o tipo..."
            placeholderTextColor={theme.colors.textSecondary}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda !== '' && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <Ionicons
            name="options"
            size={24}
            color={mostrarFiltros ? theme.colors.primary : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <View style={styles.filtersPanel}>
          {/* Tipo de ayuda */}
          <Text style={styles.filterLabel}>Tipo de Ayuda</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {TIPOS_AYUDA.map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.filterChip,
                  tipoAyudaSeleccionado === tipo && styles.filterChipActive,
                ]}
                onPress={() => setTipoAyudaSeleccionado(tipo)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    tipoAyudaSeleccionado === tipo && styles.filterChipTextActive,
                  ]}
                >
                  {tipo}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Prioridad */}
          <Text style={styles.filterLabel}>Prioridad</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {PRIORIDADES.map((prioridad) => (
              <TouchableOpacity
                key={prioridad}
                style={[
                  styles.filterChip,
                  prioridadSeleccionada === prioridad && styles.filterChipActive,
                ]}
                onPress={() => setPrioridadSeleccionada(prioridad)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    prioridadSeleccionada === prioridad && styles.filterChipTextActive,
                  ]}
                >
                  {prioridad}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Controles de vista */}
      <View style={styles.viewControls}>
        <Text style={styles.resultCount}>{casosFiltrados.length} resultados</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewButton, vistaActiva === 'lista' && styles.viewButtonActive]}
            onPress={() => setVistaActiva('lista')}
          >
            <Ionicons
              name="list"
              size={20}
              color={vistaActiva === 'lista' ? '#FFFFFF' : theme.colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, vistaActiva === 'mapa' && styles.viewButtonActive]}
            onPress={() => setVistaActiva('mapa')}
          >
            <Ionicons
              name="map"
              size={20}
              color={vistaActiva === 'mapa' ? '#FFFFFF' : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Resultados */}
      {vistaActiva === 'lista' ? (
        <FlatList
          data={casosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CasoCard caso={item} onPress={() => router.push(`/caso-detalle?id=${item.id}`)} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
              <Text style={styles.emptyStateText}>No se encontraron casos</Text>
              <Text style={styles.emptyStateSubtext}>
                Intenta ajustar tus filtros de búsqueda
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          <Ionicons name="map-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.mapPlaceholder}>Vista de mapa próximamente</Text>
          <Text style={styles.mapSubtext}>
            Se mostrará un mapa interactivo con los casos filtrados
          </Text>
        </View>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    ...theme.shadows.small,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  filtersPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  resultCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  listContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  mapPlaceholder: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
