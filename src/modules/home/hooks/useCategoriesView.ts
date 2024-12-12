import { useEffect, useMemo } from "react";
import { useCategoriesStore } from "@/src/store/useCategoriesStore";

export const useCategoriesView = () => {
  const {
    categories,
    loading,
    currentJoke,
    dialogVisible,
    fetchCategories,
    handleCategoryPress,
    setDialogVisible,
    loadFavorites,
  } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
    loadFavorites();
  }, []);

  const subtitle = useMemo(() => {
    if (categories.length === 0 && !loading) {
      return "No hay categorías disponibles";
    } else if (categories.length > 0 && !loading) {
      return "Selecciona una categoría para descubrir un divertido chiste de Chuck Norris";
    }
    return "";
  }, [categories.length, loading]);

  return {
    categories,
    loading,
    currentJoke,
    dialogVisible,
    subtitle,
    fetchCategories,
    handleCategoryPress,
    setDialogVisible,
  };
};
