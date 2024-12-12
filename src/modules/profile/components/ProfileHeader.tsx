import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface ProfileHeaderProps {
  user: FirebaseAuthTypes.User;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const theme = useTheme();
  const initials = user.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <View style={styles.header}>
      <Avatar.Text
        size={80}
        label={initials || "?"}
        style={[
          styles.avatar,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
        labelStyle={{ color: theme.colors.onPrimaryContainer }}
      />
      <Text variant="headlineSmall" style={styles.name}>
        {user.displayName}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.email, { color: theme.colors.onSurfaceVariant }]}
      >
        {user.email}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
    textAlign: "center",
  },
  email: {
    textAlign: "center",
  },
});
