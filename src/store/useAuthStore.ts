import { create } from "zustand";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { authService } from "@/src/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

interface AuthState {
  isAuthenticated: boolean;
  user: FirebaseAuthTypes.User | null;
  signIn: (
    email: string,
    password: string,
    useBiometric: boolean
  ) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    useBiometric: boolean
  ) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
  biometricAuth: () => Promise<void>;
  hasBiometricCredentials: boolean;
  checkBiometricAvailability: () => Promise<boolean>;
  setupBiometric: (shouldEnable: boolean) => Promise<void>;
  clearStoredCredentials: () => Promise<void>;
}

const CREDENTIALS_KEY = "@auth_credentials";

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  hasBiometricCredentials: false,

  checkBiometricAvailability: async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      console.log({ hasHardware });
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log({ isEnrolled });
      const savedCredentials = await AsyncStorage.getItem(CREDENTIALS_KEY);
      console.log({ savedCredentials });

      set({
        hasBiometricCredentials: !!(
          hasHardware &&
          isEnrolled &&
          savedCredentials
        ),
      });
      return !!(hasHardware && isEnrolled);
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return false;
    }
  },

  setupBiometric: async (shouldEnable: boolean) => {
    try {
      if (!shouldEnable) {
        set({ hasBiometricCredentials: false });
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          "Configura tu huella digital para futuros inicios de sesión",
        fallbackLabel: "Usar contraseña",
        cancelLabel: "No usar biometría",
      });

      if (result.success) {
        set({ hasBiometricCredentials: true });
      }
    } catch (error) {
      console.error("Error setting up biometric:", error);
    }
  },

  signIn: async (email: string, password: string, useBiometric: boolean) => {
    try {
      set({ loading: true, error: null });
      const { user, error } = await authService.signIn(email, password);

      if (error) {
        set({ error, loading: false, isAuthenticated: false });
        throw new Error(error);
      }

      if (useBiometric) {
        await AsyncStorage.setItem(
          CREDENTIALS_KEY,
          JSON.stringify({ email, password })
        );
        await get().setupBiometric(true);
      }

      set({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  biometricAuth: async () => {
    try {
      set({ loading: true, error: null });

      const savedCredentialsString = await AsyncStorage.getItem(
        CREDENTIALS_KEY
      );
      if (!savedCredentialsString) {
        throw new Error("No hay credenciales guardadas");
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación biométrica",
        fallbackLabel: "Usar contraseña",
      });

      if (result.success) {
        const credentials = JSON.parse(savedCredentialsString);
        const { user, error } = await authService.signIn(
          credentials.email,
          credentials.password
        );

        if (error) {
          throw new Error(error);
        }

        set({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        throw new Error("Autenticación biométrica fallida");
      }
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signUp: async (
    email: string,
    password: string,
    name: string,
    useBiometric: boolean
  ) => {
    try {
      set({ loading: true, error: null });
      const { user, error } = await authService.signUp(email, password, name);

      if (error) {
        set({ error, loading: false, isAuthenticated: false });
        throw new Error(error);
      }

      if (useBiometric) {
        await AsyncStorage.setItem(
          CREDENTIALS_KEY,
          JSON.stringify({ email, password })
        );
        await get().setupBiometric(true);
      }

      set({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await authService.signOut();
      // No eliminamos las credenciales guardadas para permitir el login biométrico
      set({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  clearStoredCredentials: async () => {
    try {
      await AsyncStorage.removeItem(CREDENTIALS_KEY);
      set({ hasBiometricCredentials: false });
    } catch (error) {
      console.error("Error clearing credentials:", error);
    }
  },
}));
