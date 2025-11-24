import { LOGO_URL } from '@/constants/mockData';
import { theme } from '@/constants/theme';
import { registrarUsuario } from '@/utils/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegistroScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errores, setErrores] = useState<any>({});
  const [cargando, setCargando] = useState(false);

  const validarCorreo = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarTelefono = (phone: string) => {
    const regex = /^[0-9+\s()-]{10,}$/;
    return regex.test(phone);
  };

  const handleRegister = async () => {
    const nuevosErrores: any = {};
    let valido = true;

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
      valido = false;
    }

    if (!correo) {
      nuevosErrores.correo = 'El correo es requerido';
      valido = false;
    } else if (!validarCorreo(correo)) {
      nuevosErrores.correo = 'Ingresa un correo válido';
      valido = false;
    }

    if (!telefono) {
      nuevosErrores.telefono = 'El teléfono es requerido';
      valido = false;
    } else if (!validarTelefono(telefono)) {
      nuevosErrores.telefono = 'Ingresa un teléfono válido';
      valido = false;
    }

    if (!ubicacion.trim()) {
      nuevosErrores.ubicacion = 'La ubicación es requerida';
      valido = false;
    }

    if (!contrasena) {
      nuevosErrores.contrasena = 'La contraseña es requerida';
      valido = false;
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      valido = false;
    }

    if (!confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Confirma tu contraseña';
      valido = false;
    } else if (contrasena !== confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
      valido = false;
    }

    if (!aceptaTerminos) {
      nuevosErrores.terminos = 'Debes aceptar los términos y condiciones';
      valido = false;
    }

    setErrores(nuevosErrores);

    if (valido) {
      setCargando(true);
      const resultado = await registrarUsuario(correo, contrasena, nombre, telefono, ubicacion);
      setCargando(false);

      if (resultado.success) {
        Alert.alert(
          '¡Registro Exitoso!',
          'Tu cuenta ha sido creada correctamente. Bienvenido a Aquí Estoy',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        Alert.alert('Error', resultado.error || 'No se pudo crear la cuenta');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={{ uri: LOGO_URL }} style={styles.logo} />
          <Text style={styles.appName}>Aquí Estoy</Text>
          <Text style={styles.subtitle}>Únete a nuestra comunidad solidaria</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>

          {/* Campo de nombre */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor={theme.colors.textSecondary}
              value={nombre}
              onChangeText={(text) => {
                setNombre(text);
                if (errores.nombre) setErrores({ ...errores, nombre: '' });
              }}
              autoCapitalize="words"
            />
          </View>
          {errores.nombre ? (
            <Text style={styles.errorText}>{errores.nombre}</Text>
          ) : null}

          {/* Campo de correo */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={theme.colors.textSecondary}
              value={correo}
              onChangeText={(text) => {
                setCorreo(text);
                if (errores.correo) setErrores({ ...errores, correo: '' });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          {errores.correo ? (
            <Text style={styles.errorText}>{errores.correo}</Text>
          ) : null}

          {/* Campo de teléfono */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono (ej: +52 55 1234 5678)"
              placeholderTextColor={theme.colors.textSecondary}
              value={telefono}
              onChangeText={(text) => {
                setTelefono(text);
                if (errores.telefono) setErrores({ ...errores, telefono: '' });
              }}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>
          {errores.telefono ? (
            <Text style={styles.errorText}>{errores.telefono}</Text>
          ) : null}

          {/* Campo de ubicación */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Ubicación aproximada (ciudad, colonia)"
              placeholderTextColor={theme.colors.textSecondary}
              value={ubicacion}
              onChangeText={(text) => {
                setUbicacion(text);
                if (errores.ubicacion) setErrores({ ...errores, ubicacion: '' });
              }}
              autoCapitalize="words"
            />
          </View>
          {errores.ubicacion ? (
            <Text style={styles.errorText}>{errores.ubicacion}</Text>
          ) : null}

          {/* Campo de contraseña */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Contraseña"
              placeholderTextColor={theme.colors.textSecondary}
              value={contrasena}
              onChangeText={(text) => {
                setContrasena(text);
                if (errores.contrasena) setErrores({ ...errores, contrasena: '' });
              }}
              secureTextEntry={!mostrarContrasena}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setMostrarContrasena(!mostrarContrasena)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={mostrarContrasena ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errores.contrasena ? (
            <Text style={styles.errorText}>{errores.contrasena}</Text>
          ) : null}

          {/* Campo de confirmar contraseña */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Confirmar contraseña"
              placeholderTextColor={theme.colors.textSecondary}
              value={confirmarContrasena}
              onChangeText={(text) => {
                setConfirmarContrasena(text);
                if (errores.confirmarContrasena)
                  setErrores({ ...errores, confirmarContrasena: '' });
              }}
              secureTextEntry={!mostrarConfirmar}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setMostrarConfirmar(!mostrarConfirmar)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={mostrarConfirmar ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errores.confirmarContrasena ? (
            <Text style={styles.errorText}>{errores.confirmarContrasena}</Text>
          ) : null}

          {/* Términos y condiciones */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              setAceptaTerminos(!aceptaTerminos);
              if (errores.terminos) setErrores({ ...errores, terminos: '' });
            }}
          >
            <View style={[styles.checkbox, aceptaTerminos && styles.checkboxChecked]}>
              {aceptaTerminos && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Acepto los{' '}
              <Text style={styles.linkText}>términos y condiciones</Text> y la{' '}
              <Text style={styles.linkText}>política de privacidad</Text>
            </Text>
          </TouchableOpacity>
          {errores.terminos ? (
            <Text style={styles.errorText}>{errores.terminos}</Text>
          ) : null}

          {/* Botón de registro */}
          <TouchableOpacity 
            style={[styles.registerButton, cargando && styles.registerButtonDisabled]} 
            onPress={handleRegister}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          {/* Link a login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: theme.colors.text,
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  loginText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
