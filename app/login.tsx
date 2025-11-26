import { LOGO_URL } from '@/constants/mockData';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { iniciarSesion } from '@/utils/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const { isAuthenticated, user } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState({ correo: '', contrasena: '' });
  const [cargando, setCargando] = useState(false);

  // Si ya está autenticado, redirigir
  useEffect(() => {
    console.log('Login - isAuthenticated:', isAuthenticated, 'user:', user?.email);
    if (isAuthenticated) {
      console.log('Redirigiendo a tabs...');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user]);

  const validarCorreo = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    const nuevosErrores = { correo: '', contrasena: '' };
    let valido = true;

    if (!correo) {
      nuevosErrores.correo = 'El correo es requerido';
      valido = false;
    } else if (!validarCorreo(correo)) {
      nuevosErrores.correo = 'Ingresa un correo válido';
      valido = false;
    }

    if (!contrasena) {
      nuevosErrores.contrasena = 'La contraseña es requerida';
      valido = false;
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      valido = false;
    }

    setErrores(nuevosErrores);

    if (valido) {
      setCargando(true);
      setError('');
      try {
        console.log('Intentando iniciar sesión con:', correo);
        const result = await iniciarSesion(correo, contrasena);
        
        console.log('Resultado de inicio de sesión:', result.success);
        
        if (result.success) {
          console.log('Inicio de sesión exitoso, usuario:', result.user?.email);
          // Esperar un momento para que el AuthContext se actualice
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 500);
        } else {
          setError(result.error || 'Error al iniciar sesión');
        }
      } catch (error) {
        console.error('Error inesperado en login:', error);
        setError('Error inesperado al iniciar sesión');
      } finally {
        setCargando(false);
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
          <Text style={styles.subtitle}>Conectando corazones solidarios</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
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

          {/* Olvidé mi contraseña */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Botón de login */}
          <Pressable
            style={[styles.loginButton, (cargando || isLoading) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={cargando || isLoading}
          >
            <Text style={styles.loginButtonText}>
              {cargando || isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Link a registro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/registro')}>
              <Text style={styles.registerLink}>Regístrate aquí</Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
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
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.colors.text,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  registerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
