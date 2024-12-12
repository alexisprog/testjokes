import * as React from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Chip, Text } from "react-native-paper";
import { Joke, useApi } from "@/src/services/api";
import { ThemedView } from "@/src/components/ThemedView";
import { useCallback, useEffect, useState } from "react";
import { JokeDialog } from "./components/JokeDialog";

export const CategoriesView = () => {
  const { getCategories, getJokeByCategory } = useApi();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryPress = async (category: string) => {
    try {
      setSelectedCategory(category);
      const joke = await getJokeByCategory(category);
      setCurrentJoke(joke);
      setDialogVisible(true);
    } catch (error) {
      console.error("Error fetching joke:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Categorías de Chistes
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
            <Text variant="bodyLarge" style={styles.title}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </Chip>
        ))}
      </ThemedView>
      {loading && (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Cargando categorías...</Text>
        </ThemedView>
      )}
      {categories.length === 0 && !loading && (
        <ThemedView style={styles.emptyContainer}>
          <Text>No hay categorías disponibles</Text>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
});
