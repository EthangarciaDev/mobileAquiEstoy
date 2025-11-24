// Archivo: constants/firebaseConfig.ts
// Configuración de Firebase usando Expo Constants
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;

export const firebaseConfig = {
  apiKey: extra?.firebaseApiKey || '',
  authDomain: extra?.firebaseAuthDomain || '',
  projectId: extra?.firebaseProjectId || '',
  storageBucket: extra?.firebaseStorageBucket || '',
  messagingSenderId: extra?.firebaseMessagingSenderId || '',
  appId: extra?.firebaseAppId || '',
  measurementId: extra?.firebaseMeasurementId || '',
};

export default firebaseConfig;
