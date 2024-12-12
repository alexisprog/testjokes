import * as React from "react";
import { StyleSheet } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Link } from "expo-router";
import { useRegisterView } from "./hooks/useRegisterView";
import { ThemedView } from "@/src/components/ThemedView";
import { CheckBiometric } from "../login/components/CheckBiometric";

export const RegisterView = () => {
  const { formik, loading, isBiometricAvailable } = useRegisterView();
  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    formik;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.formContainer}>
        <TextInput
          label="Nombre"
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={touched.name && !!errors.name}
          style={styles.input}
          disabled={loading}
        />
        {touched.name && errors.name && (
          <HelperText type="error">{errors.name}</HelperText>
        )}
        <TextInput
          label="Correo electrónico"
          value={values.email}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          error={touched.email && !!errors.email}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          disabled={loading}
        />
        {touched.email && errors.email && (
          <HelperText type="error">{errors.email}</HelperText>
        )}
        <TextInput
          label="Contraseña"
          value={values.password}
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          secureTextEntry
          error={touched.password && !!errors.password}
          style={styles.input}
          disabled={loading}
        />
        {touched.password && errors.password && (
          <HelperText type="error">{errors.password}</HelperText>
        )}
        <TextInput
          label="Confirmar contraseña"
          value={values.confirmPassword}
          onChangeText={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          secureTextEntry
          error={touched.confirmPassword && !!errors.confirmPassword}
          style={styles.input}
          disabled={loading}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <HelperText type="error">{errors.confirmPassword}</HelperText>
        )}
        <CheckBiometric
          handlePress={() => formik.setFieldValue("useBiometric", !values.useBiometric)}
          isBiometricAvailable={isBiometricAvailable}
          loading={loading}
          useBiometric={values.useBiometric}
        />
        <Button
          mode="contained"
          onPress={() => handleSubmit()}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Registrarse
        </Button>
        <ThemedView style={styles.linkContainer}>
          <Link href="/login" asChild>
            <Button mode="text" disabled={loading}>
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </Link>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginTop: 16,
  },
  button: {
    marginTop: 22,
  },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
});
