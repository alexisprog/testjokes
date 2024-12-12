import { create } from "zustand";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { authService } from "@/src/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useCategoriesStore } from "@/src/store/useCategoriesStore";
import { apiService } from "@/src/services/api";
import { scheduleWelcomeNotification } from "@/src/services/notifications";

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
  initializeAuth: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "@auth_user";
const CREDENTIALS_KEY = "@auth_credentials";
const LAST_EMAIL_KEY = "@last_email";

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

  initializeAuth: async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const storedCredentials = await AsyncStorage.getItem(CREDENTIALS_KEY);

      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (!get().user) {
          if (storedCredentials) {
            // Si hay credenciales biométricas, las usamos
            const { email, password } = JSON.parse(storedCredentials);
            await authService.signIn(email, password);
          } else {
            // Si no hay credenciales biométricas, intentamos renovar la sesión
            await authService.refreshSession();
          }
        }
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      // Si hay error, limpiamos todo
      await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, CREDENTIALS_KEY]);
      set({
        user: null,
        isAuthenticated: false,
        hasBiometricCredentials: false,
      });
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

      // Verificamos si es un email diferente al último guardado
      const lastEmail = await AsyncStorage.getItem(LAST_EMAIL_KEY);
      if (lastEmail && lastEmail !== email) {
        await useCategoriesStore.getState().clearFavorites();
      }

      // Guardamos el nuevo email
      await AsyncStorage.setItem(LAST_EMAIL_KEY, email);

      // Guardamos el usuario en storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      if (!useBiometric) {
        // Si no se eligió usar biometría, limpiamos las credenciales y autenticamos directamente
        await AsyncStorage.removeItem(CREDENTIALS_KEY);
        set({
          hasBiometricCredentials: false,
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        // Si se eligió usar biometría, intentamos configurarla primero
        try {
          await AsyncStorage.setItem(
            CREDENTIALS_KEY,
            JSON.stringify({ email, password })
          );

          await get().setupBiometric(true);

          // Solo autenticamos si la configuración biométrica fue exitosa
          if (get().hasBiometricCredentials) {
            set({
              isAuthenticated: true,
              user,
              loading: false,
            });
          } else {
            // Si falló la configuración biométrica, limpiamos todo
            await AsyncStorage.removeItem(CREDENTIALS_KEY);
            set({
              isAuthenticated: false,
              user: null,
              loading: false,
              hasBiometricCredentials: false,
            });
            throw new Error(
              "No se pudo configurar la autenticación biométrica"
            );
          }
        } catch (error) {
          // Si hay error en la configuración biométrica, limpiamos todo
          await AsyncStorage.removeItem(CREDENTIALS_KEY);
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            hasBiometricCredentials: false,
          });
          throw error;
        }
      }

      // Obtenemos un chiste aleatorio y programamos la notificación
      try {
        const randomJoke = await apiService.getRandomJoke();
        await scheduleWelcomeNotification(randomJoke.value);
      } catch (error) {
        console.error("Error getting random joke:", error);
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

        // Verificamos si es un email diferente
        const lastEmail = await AsyncStorage.getItem(LAST_EMAIL_KEY);
        if (lastEmail && lastEmail !== credentials.email) {
          await useCategoriesStore.getState().clearFavorites();
        }

        // Actualizamos el último email
        await AsyncStorage.setItem(LAST_EMAIL_KEY, credentials.email);

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

        // Obtenemos un chiste aleatorio y programamos la notificación
        try {
          const randomJoke = await apiService.getRandomJoke();
          await scheduleWelcomeNotification(randomJoke.value);
        } catch (error) {
          console.error("Error getting random joke:", error);
        }
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

      // Guardamos el usuario en storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(LAST_EMAIL_KEY, email);
      await useCategoriesStore.getState().clearFavorites();

      // Si no se eligió usar biometría, limpiamos las credenciales biométricas
      if (!useBiometric) {
        await AsyncStorage.removeItem(CREDENTIALS_KEY);
        set({ hasBiometricCredentials: false });
      } else {
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

      const hasBiometric = get().hasBiometricCredentials;

      // Si no hay biometría configurada, limpiamos todo
      if (!hasBiometric) {
        await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, CREDENTIALS_KEY]);
      } else {
        // Si hay biometría, solo limpiamos el usuario actual
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }

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
      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEY,
        CREDENTIALS_KEY,
        LAST_EMAIL_KEY,
      ]);
      await useCategoriesStore.getState().clearFavorites();
      set({ hasBiometricCredentials: false });
    } catch (error) {
      console.error("Error clearing credentials:", error);
    }
  },
}));
