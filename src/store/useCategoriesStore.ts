import { create } from "zustand";
import { Joke, apiService } from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_STORAGE_KEY = "@favorites_jokes";

interface CategoriesState {
  categories: string[];
  selectedCategory: string | null;
  currentJoke: Joke | null;
  loading: boolean;
  error: string | null;
  dialogVisible: boolean;
  favorites: Joke[];
  fetchCategories: () => Promise<void>;
  handleCategoryPress: (category: string) => Promise<void>;
  setDialogVisible: (visible: boolean) => void;
  addToFavorites: (joke: Joke) => Promise<void>;
  removeFromFavorites: (jokeId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  clearFavorites: () => Promise<void>;
  isJokeFavorite: (jokeId: string) => boolean;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  selectedCategory: null,
  currentJoke: null,
  loading: false,
  error: null,
  dialogVisible: false,
  favorites: [],

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const data = await apiService.getCategories();
      set({ categories: data });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
      });
      console.error("Error fetching categories:", error);
    } finally {
      set({ loading: false });
    }
  },

  handleCategoryPress: async (category: string) => {
    try {
      set({ selectedCategory: category, error: null });
      const joke = await apiService.getJokeByCategory(category);
      set({ currentJoke: joke, dialogVisible: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
      });
      console.error("Error fetching joke:", error);
    }
  },

  setDialogVisible: (visible: boolean) => {
    set({ dialogVisible: visible });
  },

  addToFavorites: async (joke: Joke) => {
    try {
      const currentFavorites = [...get().favorites];
      const updatedFavorites = [...currentFavorites, joke];

      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      );

      set({ favorites: updatedFavorites });
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  },

  removeFromFavorites: async (jokeId: string) => {
    try {
      const currentFavorites = [...get().favorites];
      const updatedFavorites = currentFavorites.filter(
        (joke) => joke.id !== jokeId
      );

      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      );

      set({ favorites: updatedFavorites });
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  },

  loadFavorites: async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        set({ favorites: JSON.parse(storedFavorites) });
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  },

  clearFavorites: async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      set({ favorites: [] });
    } catch (error) {
      console.error("Error clearing favorites:", error);
    }
  },

  isJokeFavorite: (jokeId: string) => {
    return get().favorites.some((joke) => joke.id === jokeId);
  },
}));
