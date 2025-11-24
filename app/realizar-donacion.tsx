import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const TIPOS_AYUDA = [
  { id: 'alimentos', label: 'Alimentos', icon: 'fast-food' },
  { id: 'ropa', label: 'Ropa/Cobijas', icon: 'shirt' },
  { id: 'medicamentos', label: 'Medicamentos', icon: 'medical' },
  { id: 'utiles', label: 'Útiles', icon: 'book' },
  { id: 'otros', label: 'Otros', icon: 'gift' },
];

const METODOS_ENTREGA = [
  {
    id: 'personal',
    label: 'Entrega Personal',
    descripcion: 'Entregaré la ayuda directamente al beneficiario',
    icon: 'hand-left',
  },
  {
    id: 'intermediario',
    label: 'A través de Intermediario',
    descripcion: 'La ayuda será entregada por un centro de acopio o voluntario',
    icon: 'business',
  },
];

export default function RealizarDonacionScreen() {
  const router = useRouter();
  const [tipoAyuda, setTipoAyuda] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('');

  const handleConfirmar = () => {
    if (!tipoAyuda || !cantidad || !metodoEntrega) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos requeridos');
      return;
    }

    Alert.alert(
      '¡Donación Confirmada!',
      'Gracias por tu generosidad. Tu ayuda llegará pronto a quien la necesita.',
      [
        {
          text: 'Ver mis donaciones',
          onPress: () => router.push('/historial-donaciones'),
        },
        {
          text: 'Volver al inicio',
          onPress: () => router.push('/(tabs)'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Realizar Donación</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Información del caso */}
        <View style={styles.casoCard}>
          <Image
            source={{
              uri: 'https://media.istockphoto.com/id/483691035/es/foto/ni%C3%B1o-de-brasil.jpg?s=612x612&w=0&k=20&c=nf_T3LnIgJKoP9TY2AsVYYeUJqd6zu6FbGKAVzfv8aI=',
            }}
            style={styles.casoImage}
          />
          <View style={styles.casoInfo}>
            <Text style={styles.casoTitulo}>Juan tiene hambre (Urgente)</Text>
            <View style={styles.casoMeta}>
              <Ionicons name="location" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.casoMetaText}>Zona Sur, Ciudad de México</Text>
            </View>
          </View>
        </View>

        {/* Selección de tipo de ayuda */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ¿Qué tipo de ayuda vas a ofrecer? <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.optionsGrid}>
            {TIPOS_AYUDA.map((tipo) => (
              <TouchableOpacity
                key={tipo.id}
                style={[styles.optionCard, tipoAyuda === tipo.id && styles.optionCardActive]}
                onPress={() => setTipoAyuda(tipo.id)}
              >
                <Ionicons
                  name={tipo.icon as any}
                  size={32}
                  color={tipoAyuda === tipo.id ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    tipoAyuda === tipo.id && styles.optionLabelActive,
                  ]}
                >
                  {tipo.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cantidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Cantidad o descripción <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5 kg de arroz, 3 cobijas, etc."
            placeholderTextColor={theme.colors.textSecondary}
            value={cantidad}
            onChangeText={setCantidad}
          />
        </View>

        {/* Descripción adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles adicionales (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Agrega cualquier detalle que consideres importante..."
            placeholderTextColor={theme.colors.textSecondary}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Método de entrega */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ¿Cómo entregarás la ayuda? <Text style={styles.required}>*</Text>
          </Text>
          {METODOS_ENTREGA.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                styles.metodoCard,
                metodoEntrega === metodo.id && styles.metodoCardActive,
              ]}
              onPress={() => setMetodoEntrega(metodo.id)}
            >
              <View style={styles.metodoIcon}>
                <Ionicons
                  name={metodo.icon as any}
                  size={24}
                  color={
                    metodoEntrega === metodo.id ? theme.colors.primary : theme.colors.textSecondary
                  }
                />
              </View>
              <View style={styles.metodoInfo}>
                <Text
                  style={[
                    styles.metodoLabel,
                    metodoEntrega === metodo.id && styles.metodoLabelActive,
                  ]}
                >
                  {metodo.label}
                </Text>
                <Text style={styles.metodoDescripcion}>{metodo.descripcion}</Text>
              </View>
              <View style={styles.radioButton}>
                {metodoEntrega === metodo.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Resumen */}
        <View style={styles.resumenCard}>
          <Text style={styles.resumenTitle}>Resumen de tu donación</Text>
          <View style={styles.resumenRow}>
            <Ionicons name="gift-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.resumenLabel}>Tipo:</Text>
            <Text style={styles.resumenValue}>
              {tipoAyuda
                ? TIPOS_AYUDA.find((t) => t.id === tipoAyuda)?.label
                : 'No seleccionado'}
            </Text>
          </View>
          <View style={styles.resumenRow}>
            <Ionicons name="cube-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.resumenLabel}>Cantidad:</Text>
            <Text style={styles.resumenValue}>{cantidad || 'No especificada'}</Text>
          </View>
          <View style={styles.resumenRow}>
            <Ionicons name="car-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.resumenLabel}>Entrega:</Text>
            <Text style={styles.resumenValue}>
              {metodoEntrega
                ? METODOS_ENTREGA.find((m) => m.id === metodoEntrega)?.label
                : 'No seleccionado'}
            </Text>
          </View>
        </View>

        {/* Botón de confirmación */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmar}>
          <Ionicons name="heart" size={24} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Confirmar Donación</Text>
        </TouchableOpacity>

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
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  casoCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    ...theme.shadows.small,
  },
  casoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  casoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  casoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  casoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  casoMetaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  required: {
    color: theme.colors.error,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  optionCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  optionLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  optionLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 100,
  },
  metodoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  metodoCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  metodoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metodoInfo: {
    flex: 1,
  },
  metodoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  metodoLabelActive: {
    color: theme.colors.primary,
  },
  metodoDescripcion: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  resumenCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.small,
  },
  resumenTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  resumenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resumenLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
    width: 80,
  },
  resumenValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});
