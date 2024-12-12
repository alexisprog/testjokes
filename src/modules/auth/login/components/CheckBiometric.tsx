import * as React from "react";
import { StyleSheet } from "react-native";
import {
  HelperText,
  Checkbox,
} from "react-native-paper";
import { ThemedView } from "@/src/components/ThemedView";

interface CheckBiometricProps {
  handlePress: () => void;
  isBiometricAvailable: boolean;
  loading: boolean;
  useBiometric: boolean;
}

export const CheckBiometric: React.FC<CheckBiometricProps> = ({
  handlePress,
  isBiometricAvailable,
  loading,
  useBiometric
}) => {
  if (!isBiometricAvailable) {
    return null;
  }
  return (
    <ThemedView style={styles.checkboxContainer}>
      <Checkbox
        status={useBiometric ? "checked" : "unchecked"}
        onPress={handlePress}
        disabled={loading}
      />
      <HelperText type="info">
        Habilitar autenticación biométrica para inicios de sesión futuros
      </HelperText>
    </ThemedView>
    );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center", 
    marginTop: 16,
  },
});
