import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useErrorStore } from "@/src/store/useErrorStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

interface LoginFormValues {
  email: string;
  password: string;
  useBiometric: boolean;
}

export const useLoginView = () => {
  const showError = useErrorStore((state) => state.showError);
  const {
    signIn,
    loading,
    biometricAuth,
    checkBiometricAvailability,
    hasBiometricCredentials,
    clearStoredCredentials,
    isAuthenticated
  } = useAuthStore();
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    checkBiometricAvailability().then(setIsBiometricAvailable);
  }, []);

  const handleBiometricAuth = async () => {
    try {
      await biometricAuth();
      router.replace("/");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Error en la autenticación biométrica"
      );
    }
  };

  const handleForgetUser = async () => {
    try {
      await clearStoredCredentials();
      setShowForm(true);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Error al olvidar usuario"
      );
    }
  };

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      useBiometric: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await signIn(values.email, values.password, values.useBiometric);
        router.replace("/");
      } catch (error) {
        showError(
          error instanceof Error ? error.message : "Error al iniciar sesión"
        );
      }
    },
  });

  return {
    formik,
    loading,
    isBiometricAvailable,
    hasBiometricCredentials,
    isAuthenticated,
    showForm,
    handleBiometricAuth,
    handleForgetUser,
    setShowForm,
  };
};
