import * as React from 'react';
import { StyleSheet } from "react-native";
import {
  Button,
  IconButton,
  Text,
} from "react-native-paper";
import { ThemedView } from "@/src/components/ThemedView";

interface BiometricAccessProps {
  handleBiometricAuth: () => void;
  handleForgetUser: () => void;
  loading: boolean;
  setShowForm: (showForm: boolean) => void;
}

export const BiometricAccess: React.FC<BiometricAccessProps> = ({
  handleBiometricAuth,
  handleForgetUser,
  loading,
  setShowForm,
}) => {
  return (
    <ThemedView style={styles.container}>
        <ThemedView style={styles.biometricContainer}>
          <Text variant="titleMedium" style={styles.biometricText}>
            Inicia sesión con factor biométrico
          </Text>
          <IconButton
            icon="fingerprint"
            size={80}
            onPress={handleBiometricAuth}
            disabled={loading}
            style={styles.biometricIcon}
          />
          <Button
            mode="text"
            onPress={() => setShowForm(true)}
            style={styles.alternativeButton}
          >
            Usar correo y contraseña
          </Button>
          <Button
            mode="text"
            onPress={handleForgetUser}
            style={styles.forgetButton}
          >
            Olvidar usuario
          </Button>
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
  biometricContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  biometricText: {
    marginBottom: 24,
    textAlign: "center",
  },
  biometricIcon: {
    marginBottom: 24,
  },
  alternativeButton: {
    marginTop: 16,
  },
  forgetButton: {
    marginTop: 8,
  },
});