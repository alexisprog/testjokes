import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useErrorStore } from "@/src/store/useErrorStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  useBiometric: boolean;
}

export const useRegisterView = () => {
  const showError = useErrorStore((state) => state.showError);
  const { signUp, loading, checkBiometricAvailability } = useAuthStore();
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability().then(setIsBiometricAvailable);
  }, []);

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      useBiometric: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        await signUp(
          values.email,
          values.password,
          values.name,
          values.useBiometric
        );
        router.replace("/");
      } catch (error) {
        showError(
          error instanceof Error ? error.message : "Error al registrarse"
        );
      }
    },
  });

  return {
    formik,
    loading,
    isBiometricAvailable,
  };
};
