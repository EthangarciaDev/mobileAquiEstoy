import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Caso } from '@/types';
import { crearDonacion, usuarioYaDono } from '@/utils/donacionesService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface CasoDetalleProps {
  caso: Caso;
}

const CATEGORIAS_DONACION = [
  { value: 'alimentos', label: 'Alimentos', icon: 'fast-food' },
  { value: 'ropa', label: 'Cobijas y ropa', icon: 'shirt' },
  { value: 'medicamentos', label: 'Medicamentos', icon: 'medical' },
  { value: 'otros', label: 'Otros', icon: 'cube' },
];

const METODOS_ENTREGA = [
  { value: 'personal', label: 'Entrega Personal', description: 'Entregaré directamente al beneficiario' },
  { value: 'intermediario', label: 'A través de Intermediario', description: 'Necesitare un beneficiaro.' },
];

export function CasoDetalle({ caso }: CasoDetalleProps) {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [yaDono, setYaDono] = useState(false);

  useEffect(() => {
    console.log('CasoDetalle useEffect - user:', user ? `exists (${user.uid})` : 'null', 'userData:', userData ? `exists (${userData.nombre})` : 'null');
    verificarDonacion();
  }, [caso.id, user]);

  const verificarDonacion = async () => {
    if (user && caso.id) {
      console.log('Verificando donación para usuario:', user.uid, 'caso:', caso.id);
      const yaDonoResult = await usuarioYaDono(caso.id, user.uid);
      console.log('Ya donó:', yaDonoResult);
      setYaDono(yaDonoResult);
    }
  };

  const handleComprometerse = () => {
    console.log('handleComprometerse - user:', user ? 'existe' : 'null', 'userData:', userData ? 'existe' : 'null');
    
    if (!user) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para poder ayudar en un caso',
        [{ text: 'Ir a login', onPress: () => router.push('/login') }, { text: 'Cancelar' }]
      );
      return;
    }
    
    if (!userData) {
      Alert.alert(
        'Cargando datos',
        'Espera un momento mientras cargamos tu información...'
      );
      return;
    }
    
    setMostrarFormulario(true);
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setCategoriaSeleccionada('');
    setCantidad('');
    setMetodoEntrega('');
  };

  const handleConfirmarDonacion = async () => {
    if (!categoriaSeleccionada || !cantidad || !metodoEntrega) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos del formulario');
      return;
    }

    if (!user || !userData) {
      Alert.alert('Error', 'Debes iniciar sesión para continuar');
      return;
    }

    setProcesando(true);

    const resultado = await crearDonacion(
      caso.id,
      user.uid,
      userData.nombre,
      categoriaSeleccionada,
      cantidad,
      metodoEntrega === 'personal' ? 'Personal' : 'Intermediario'
    );

    setProcesando(false);
    setMostrarFormulario(false);

    if (resultado.success) {
      Alert.alert(
        '¡Gracias por tu ayuda!',
        `Tu donación de ${cantidad} ha sido registrada. El caso se ha marcado como completado y se ha agregado a tu historial.`,
        [
          {
            text: 'Ver mis donaciones',
            onPress: () => router.push('/historial-donaciones'),
          },
          {
            text: 'Ver mi impacto',
            onPress: () => router.push('/mi-impacto'),
          },
          {
            text: 'Volver',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert('Error', resultado.error || 'No se pudo registrar la donación');
    }
  };

  return (
    <SafeAreaView style={styles.detailSafeArea}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Detalle del Caso</Text>
      </View>

      <ScrollView style={styles.detailContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        <Image source={{ uri: caso.img }} style={styles.detailImage} />

        <View style={styles.detailInfoBox}>
          <Text style={styles.detailTitle}>{caso.titulo}</Text>
          
          <View style={styles.pillContainer}>
            <Text style={[styles.pill, styles.pillPriority]}>
              Prioridad: {caso.prioridad.toUpperCase()}
            </Text>
            <Text style={[styles.pill, styles.pillLocation]}>
              📍 {caso.ubicacion}
            </Text>
          </View>

          <Text style={styles.sectionTitleDetail}>Descripción del Caso</Text>
          <Text style={styles.descriptionText}>{caso.descripcion}</Text>
          
          <Text style={styles.sectionTitleDetail}>Necesidad Específica</Text>
          <Text style={styles.detailText}>{caso.tipoAyuda}</Text>
          
          <Text style={styles.sectionTitleDetail}>Información Adicional</Text>
          <Text style={styles.detailText}>{caso.fecha}</Text>
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleComprometerse}>
          <Text style={styles.btnPrimaryText}>✨ ¡Quiero Ayudar en este Caso!</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Formulario de Donación */}
      <Modal
        visible={mostrarFormulario}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelarFormulario}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Header del Modal */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Registrar Donación</Text>
                <TouchableOpacity onPress={handleCancelarFormulario}>
                  <Ionicons name="close" size={28} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {/* Información del Caso */}
              <View style={styles.casoInfoCard}>
                <Text style={styles.casoInfoLabel}>Caso:</Text>
                <Text style={styles.casoInfoText}>{caso.titulo}</Text>
              </View>

              {/* Categoría de Donación */}
              <Text style={styles.formLabel}>Categoría de Donación *</Text>
              <View style={styles.categoriasContainer}>
                {CATEGORIAS_DONACION.map((categoria) => (
                  <TouchableOpacity
                    key={categoria.value}
                    style={[
                      styles.categoriaCard,
                      categoriaSeleccionada === categoria.value && styles.categoriaCardSelected,
                    ]}
                    onPress={() => setCategoriaSeleccionada(categoria.value)}
                  >
                    <Ionicons
                      name={categoria.icon as any}
                      size={32}
                      color={
                        categoriaSeleccionada === categoria.value
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.categoriaLabel,
                        categoriaSeleccionada === categoria.value && styles.categoriaLabelSelected,
                      ]}
                    >
                      {categoria.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cantidad de Donación */}
              <Text style={styles.formLabel}>Cantidad o Descripción *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: 10 kg de arroz, 5 cobijas, 2 cajas de medicamentos..."
                placeholderTextColor={theme.colors.textSecondary}
                value={cantidad}
                onChangeText={setCantidad}
                multiline
                numberOfLines={3}
              />

              {/* Método de Entrega */}
              <Text style={styles.formLabel}>Método de Entrega *</Text>
              {METODOS_ENTREGA.map((metodo) => (
                <TouchableOpacity
                  key={metodo.value}
                  style={[
                    styles.metodoCard,
                    metodoEntrega === metodo.value && styles.metodoCardSelected,
                  ]}
                  onPress={() => setMetodoEntrega(metodo.value)}
                >
                  <View style={styles.radioButton}>
                    {metodoEntrega === metodo.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <View style={styles.metodoInfo}>
                    <Text
                      style={[
                        styles.metodoLabel,
                        metodoEntrega === metodo.value && styles.metodoLabelSelected,
                      ]}
                    >
                      {metodo.label}
                    </Text>
                    <Text style={styles.metodoDescription}>{metodo.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Botones de Acción */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.btnCancelar}
                  onPress={handleCancelarFormulario}
                >
                  <Text style={styles.btnCancelarText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnConfirmar}
                  onPress={handleConfirmarDonacion}
                >
                  <Ionicons name="heart" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.btnConfirmarText}>Confirmar Donación</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  detailSafeArea: { 
    flex: 1, 
    backgroundColor: '#ECF0F1' 
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2980B9',
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  detailContainer: { 
    flex: 1 
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  detailInfoBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 10,
  },
  pillContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 10,
    marginBottom: 5,
  },
  pillPriority: {
    backgroundColor: '#E74C3C',
    color: '#fff',
  },
  pillLocation: {
    backgroundColor: '#ECF0F1',
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#BDC3C7',
  },
  descriptionText: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 10,
  },
  sectionTitleDetail: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#2C3E50", 
    marginTop: 10, 
    marginBottom: 6, 
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  btnPrimary: {
    backgroundColor: "#3498DB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: "#2980B9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilos del Modal de Formulario
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    ...theme.shadows.large,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  casoInfoCard: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  casoInfoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  casoInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categoriaCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  categoriaCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  categoriaLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  categoriaLabelSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  metodoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  metodoCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
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
  metodoLabelSelected: {
    color: theme.colors.primary,
  },
  metodoDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  btnCancelarText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  btnConfirmar: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  btnConfirmarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
