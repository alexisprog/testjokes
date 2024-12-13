import { useState, useCallback, useMemo } from "react";
import { Joke, useApi } from "@/src/services/api";
import { useDebouncedCallback } from "use-debounce";
import { useCategoriesStore } from "@/src/store/useCategoriesStore";

export const useSearchView = () => {
  const { searchJokes } = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(false);

  const { favorites, removeFromFavorites, addToFavorites } =
    useCategoriesStore();

  const searchError = useMemo(() => {
    if (!searchQuery) return "";
    if (searchQuery.length < 3) {
      return "La búsqueda debe tener al menos 3 caracteres";
    }
    if (searchQuery.length > 120) {
      return "La búsqueda no debe exceder los 120 caracteres";
    }
    return "";
  }, [searchQuery]);

  const isValidSearch = useMemo(() => {
    return searchQuery.length >= 3 && searchQuery.length <= 120;
  }, [searchQuery]);

  const handleSearchJokes = useDebouncedCallback(async (query: string) => {
    if (!query.trim() || !isValidSearch) {
      setJokes([]);
      return;
    }

    try {
      setLoading(true);
      const { result } = await searchJokes(query);
      setJokes(result);
    } catch (error) {
      console.error("Error searching jokes:", error);
      setJokes([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    handleSearchJokes(query);
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setJokes([]);
  }, []);

  const handleAddFavorite = useCallback(async (joke: Joke) => {
    await addToFavorites(joke);
  }, []);

  return {
    searchQuery,
    jokes,
    loading,
    searchError,
    isValidSearch,
    favorites,
    handleSearch,
    handleClear,
    handleAddFavorite,
  };
};
