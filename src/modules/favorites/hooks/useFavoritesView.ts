import { useCallback } from "react";
import { useCategoriesStore } from "@/src/store/useCategoriesStore";

export const useFavoritesView = () => {
  const { favorites, removeFromFavorites, loadFavorites } =
    useCategoriesStore();

  const handleRemoveFavorite = useCallback(async (jokeId: string) => {
    await removeFromFavorites(jokeId);
  }, []);

  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, []);

  return {
    favorites,
    handleRemoveFavorite,
    refreshFavorites,
  };
};
