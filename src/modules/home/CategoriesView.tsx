import * as React from "react";
import { StyleSheet, Platform } from "react-native";
import { ActivityIndicator, Chip, Text } from "react-native-paper";
import { ThemedView } from "@/src/components/ThemedView";
import { useEffect } from "react";
import { JokeDialog } from "./components/JokeDialog";
import { useCategoriesView } from "./hooks/useCategoriesView";

export const CategoriesView = () => {
  const {
    categories,
    loading,
    currentJoke,
    dialogVisible,
    subtitle,
    fetchCategories,
    handleCategoryPress,
    setDialogVisible,
  } = useCategoriesView();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Categorías de Chistes
      </Text>
      {!loading && (
        <ThemedView>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
          <ThemedView style={styles.chipContainer}>
            {categories.map((category) => (
              <Chip
                key={category}
                mode="flat"
                onPress={() => handleCategoryPress(category)}
                style={styles.chip}
                showSelectedOverlay
                elevated
              >
                <Text variant="bodyLarge">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </Chip>
            ))}
          </ThemedView>
        </ThemedView>
      )}

      {loading && (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando categorías...</Text>
        </ThemedView>
      )}
      <JokeDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        joke={currentJoke}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 26,
    textAlign: "center",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  chip: {
    margin: 4,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
});
