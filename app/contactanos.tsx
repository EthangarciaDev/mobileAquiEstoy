import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Alert, 
  StyleSheet, 
  FlatList, 
  ScrollView,
  ActivityIndicator
} from 'react-native';

const STORAGE_KEY = '@contact_reports';

interface Report {
  id: string;
  name: string;
  subject: string;
  description: string;
  date: string;
}

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [reports, setReports] = useState<Report[]>([]); 
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const savedReports = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedReports !== null) {
        setReports(JSON.parse(savedReports));
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      Alert.alert('Error', 'No se pudieron cargar los mensajes guardados');
    } finally {
      setLoading(false);
    }
  };

  const saveReports = async (newReports: Report[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
      setReports([...newReports]);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error al guardar reportes:', error);
      Alert.alert('Error', 'No se pudo guardar el mensaje');
    }
  };

  const handleStartEdit = (item: Report) => {
    setEditingId(item.id);
    setName(item.name);
    setSubject(item.subject);
    setDescription(item.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSubject('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este mensaje?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedReports = reports.filter(report => report.id !== id);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
              setReports([...updatedReports]);
              setRefreshKey(prev => prev + 1);
              Alert.alert('Éxito', 'Mensaje eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', 'No se pudo eliminar el mensaje');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (name.trim() === '' || subject.trim() === '' || description.trim() === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    let updatedReports: Report[];

    if (editingId) {
      updatedReports = reports.map(report =>
        report.id === editingId
          ? {
              ...report,
              name: name.trim(),
              subject: subject.trim(),
              description: description.trim(),
              date: new Date().toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              }) + ' (Editado)',
            }
          : report
      );
      Alert.alert('Mensaje Actualizado', 'El reporte ha sido modificado exitosamente.');
      setEditingId(null);
    } else {
      const newReport: Report = {
        id: Date.now().toString(),
        name: name.trim(),
        subject: subject.trim(),
        description: description.trim(),
        date: new Date().toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      updatedReports = [newReport, ...reports];
      Alert.alert(
        'Mensaje Enviado',
        `Gracias ${name.trim()}.\nTu reporte con el asunto "${subject.trim()}" ha sido enviado.`,
        [{ text: 'OK' }]
      );
    }

    await saveReports(updatedReports);
    setName('');
    setSubject('');
    setDescription('');
  };

  const ReportItem = ({ item, onEdit, onDelete }: { 
    item: Report; 
    onEdit: (item: Report) => void; 
    onDelete: (id: string) => void; 
  }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reportSubject}>{item.subject}</Text>
      <Text style={styles.reportDetail}>Enviado por: {item.name}</Text>
      <Text style={styles.reportDetail} numberOfLines={2}>
        Descripción: {item.description}
      </Text>
      <Text style={styles.reportDate}>{item.date}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => onEdit(item)} color="#F39C12" />
        <Button title="Eliminar" onPress={() => onDelete(item.id)} color="#E74C3C" />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={{ marginTop: 10, color: '#7F8C8D' }}>Cargando mensajes...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contáctanos</Text>
      <Text style={styles.subtitle}>
        {editingId ? `Editando mensaje: "${subject}"` : '¿Tienes una pregunta o sugerencia? ¡Escríbenos!'}
      </Text>

      <TextInput
        placeholder="Tu Nombre"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Asunto"
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        placeholder="Escribe tu mensaje o descripción detallada aquí..."
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.formButtonContainer}>
        {editingId && (
          <View style={{ flex: 1, marginRight: 10 }}>
            <Button title="Cancelar Edición" onPress={handleCancelEdit} color="#95A5A6" />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Button
            title={editingId ? "Actualizar Mensaje" : "Enviar Mensaje"}
            onPress={handleSubmit}
            color={editingId ? "#2ECC71" : "#3498DB"}
          />
        </View>
      </View>
      
      <Text style={styles.listTitle}>Mensajes Enviados ({reports.length})</Text>

      <FlatList
        key={refreshKey}
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportItem 
            item={item} 
            onEdit={handleStartEdit} 
            onDelete={handleDelete} 
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>Aún no has enviado ningún reporte.</Text>
        }
        scrollEnabled={false}
        style={styles.flatList}
        extraData={refreshKey}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#ECF0F1',
    minHeight: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    height: 45,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  formButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 30,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#BDC3C7',
    paddingBottom: 5,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#3498DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  reportDetail: {
    fontSize: 14,
    color: '#555',
  },
  reportDate: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 5,
    textAlign: 'right',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 20,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10, 
  },
  flatList: {
    marginBottom: 20,
  }
});
