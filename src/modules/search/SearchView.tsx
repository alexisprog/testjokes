import React, { useCallback } from "react";
import { StyleSheet, FlatList, Platform } from "react-native";
import {
  Searchbar,
  Text,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import { ThemedView } from "@/src/components/ThemedView";
import { useSearchView } from "./hooks/useSearchView";
import { JokeItem } from "./components/JokeItem";
import { Joke } from "@/src/services/api";

export const SearchView = () => {
  const {
    searchQuery,
    jokes,
    loading,
    searchError,
    isValidSearch,
    handleSearch,
    handleClear,
  } = useSearchView();

  const renderItem = useCallback(
    ({ item }: { item: Joke }) => <JokeItem joke={item} />,
    []
  );

  const keyExtractor = useCallback((item: Joke) => item.id, []);

  const ListEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <ThemedView style={styles.emptyContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.emptyText}>
            Buscando chistes...
          </Text>
        </ThemedView>
      );
    }

    if (searchQuery.trim() && isValidSearch) {
      return (
        <ThemedView style={styles.emptyContainer}>
          <Text variant="bodyLarge">No se encontraron chistes</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Intenta con otra búsqueda
          </Text>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.emptyContainer}>
        <Text variant="bodyLarge">Busca chistes de Chuck Norris</Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Escribe algo en la barra de búsqueda
        </Text>
      </ThemedView>
    );
  }, [loading, searchQuery, isValidSearch]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView>
        <Searchbar
          placeholder="Buscar chistes..."
          onChangeText={handleSearch}
          value={searchQuery}
          loading={loading}
          onClearIconPress={handleClear}
          style={[styles.searchBar, searchError ? styles.searchBarError : null]}
        />
        {searchError ? (
          <HelperText type="error" visible={!!searchError}>
            {searchError}
          </HelperText>
        ) : null}
      </ThemedView>
      <FlatList
        data={isValidSearch ? jokes : []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          Platform.OS === "ios" ? styles.listContentIOS : null,
        ]}
        ListEmptyComponent={ListEmptyComponent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    marginBottom: 0,
    elevation: 4,
  },
  searchBarError: {
    borderColor: "red",
    borderWidth: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  listContentIOS: {
    paddingBottom: 110,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
  },
});
