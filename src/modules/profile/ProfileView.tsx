import React from "react";
import { StyleSheet, ScrollView, Platform } from "react-native";
import { Button, Divider, Surface, Text, useTheme } from "react-native-paper";
import { ThemedView } from "@/src/components/ThemedView";
import { useProfileView } from "./hooks/useProfileView";
import { ProfileHeader } from "./components/ProfileHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const ProfileView = () => {
  const { user, loading, handleSignOut } = useProfileView();
  const theme = useTheme();

  if (!user) return null;

  return (
    <ThemedView style={styles.container}>
      <ProfileHeader user={user} />
      <Divider style={styles.divider} />

      <Surface style={styles.infoContainer} elevation={1}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Información de la cuenta
        </Text>

        <ThemedView style={styles.infoRow}>
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color={theme.colors.onSurface}
          />
          <Text variant="bodyMedium" style={styles.infoText}>
            {user.email}
          </Text>
        </ThemedView>

        <ThemedView style={styles.infoRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={theme.colors.onSurface}
          />
          <Text variant="bodyMedium" style={styles.infoText}>
            Cuenta creada el{" "}
            {new Date(user.metadata.creationTime).toLocaleDateString()}
          </Text>
        </ThemedView>
      </Surface>
      <Button
        mode="contained"
        onPress={handleSignOut}
        loading={loading}
        style={styles.signOutButton}
        icon="logout"
      >
        Cerrar Sesión
      </Button>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  divider: {
    marginVertical: 24,
  },
  infoContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  signOutButton: {
    marginTop: "auto",
    marginBottom: 120,
  },
});
