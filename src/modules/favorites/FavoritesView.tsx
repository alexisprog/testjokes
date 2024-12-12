import * as React from "react";
import { StyleSheet, FlatList, RefreshControl, Platform } from "react-native";
import { Text } from "react-native-paper";
import { ThemedView } from "@/src/components/ThemedView";
import { useFavoritesView } from "./hooks/useFavoritesView";
import { FavoriteItem } from "./components/FavoriteItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback, useState } from "react";
import { Joke } from "@/src/services/api";

export const FavoritesView = () => {
  const { favorites, handleRemoveFavorite, refreshFavorites } =
    useFavoritesView();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFavorites();
    setRefreshing(false);
  }, [refreshFavorites]);

  const renderItem = useCallback(
    ({ item }: { item: Joke }) => (
      <FavoriteItem joke={item} onRemove={handleRemoveFavorite} />
    ),
    [handleRemoveFavorite]
  );

  const keyExtractor = useCallback((item: Joke) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <ThemedView style={styles.emptyContainer}>
        <Text variant="bodyLarge">No tienes chistes favoritos</Text>
        <Text variant="bodyMedium" style={styles.emptySubtitle}>
          Agrega algunos desde la sección de categorías
        </Text>
      </ThemedView>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemedView style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Mis Favoritos
        </Text>
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          windowSize={5}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          removeClippedSubviews={true}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 16,
    marginTop: Platform.OS === 'ios' ? 16 : 0,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptySubtitle: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
  },
});
