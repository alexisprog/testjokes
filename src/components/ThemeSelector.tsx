import React from "react";
import { StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useThemeStore } from "@/src/store/useThemeStore";
import type { ThemeMode } from "@/src/store/useThemeStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const ThemeSelector = () => {
  const { themeMode, setThemeMode } = useThemeStore();

  const buttons = [
    {
      value: "system",
      label: "Sistema",
      icon: ({ size, color }: { size: number; color: string }) => (
        <MaterialCommunityIcons
          name="theme-light-dark"
          size={size}
          color={color}
        />
      ),
    },
    {
      value: "light",
      label: "Claro",
      icon: ({ size, color }: { size: number; color: string }) => (
        <MaterialCommunityIcons
          name="white-balance-sunny"
          size={size}
          color={color}
        />
      ),
    },
    {
      value: "dark",
      label: "Oscuro",
      icon: ({ size, color }: { size: number; color: string }) => (
        <MaterialCommunityIcons
          name="moon-waning-crescent"
          size={size}
          color={color}
        />
      ),
    },
  ];

  return (
    <SegmentedButtons
      value={themeMode}
      onValueChange={(value) => setThemeMode(value as ThemeMode)}
      buttons={buttons}
      style={styles.group}
    />
  );
};

const styles = StyleSheet.create({
  group: {
    marginBottom: 20,
  },
});
