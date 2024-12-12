import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/src/hooks/useColorScheme";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
}

export const SafeAreaWrapper = ({ children }: SafeAreaWrapperProps) => {
  const { theme, isDarkMode } = useColorScheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      edges={["top", "right", "left"]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
