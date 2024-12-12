import { useCallback } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";

export const useProfileView = () => {
  const { user, signOut, loading } = useAuthStore();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [signOut]);

  return {
    user,
    loading,
    handleSignOut,
  };
};
