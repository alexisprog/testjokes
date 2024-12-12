import * as React from "react";
import { StyleSheet } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Link, Redirect } from "expo-router";
import { useLoginView } from "./hooks/useLoginView";
import { ThemedView } from "@/src/components/ThemedView";
import { BiometricAccess } from "./components/BiometricAccess";
import { CheckBiometric } from "./components/CheckBiometric";

export const LoginView = () => {
  const {
    formik,
    loading,
    isBiometricAvailable,
    hasBiometricCredentials,
    handleBiometricAuth,
    handleForgetUser,
    showForm,
    setShowForm,
    isAuthenticated,
  } = useLoginView();
  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    formik;

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  if (isBiometricAvailable && hasBiometricCredentials && !showForm) {
    return (
      <BiometricAccess
        handleBiometricAuth={handleBiometricAuth}
        handleForgetUser={handleForgetUser}
        loading={loading}
        setShowForm={setShowForm}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.formContainer}>
        <CheckBiometric
          handlePress={() =>
            formik.setFieldValue("useBiometric", !values.useBiometric)
          }
          isBiometricAvailable={isBiometricAvailable}
          loading={loading}
          useBiometric={values.useBiometric}
        />
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
        <Button
          mode="contained"
          onPress={() => handleSubmit()}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Iniciar sesión
        </Button>
        <ThemedView style={styles.linkContainer}>
          <Link href="/register" asChild>
            <Button mode="text" disabled={loading}>
              ¿No tienes cuenta? Regístrate
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
