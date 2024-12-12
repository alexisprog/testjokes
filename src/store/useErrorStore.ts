import { create } from "zustand";

interface ErrorState {
  isVisible: boolean;
  message: string;
  showError: (message: string) => void;
  hideError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  isVisible: false,
  message: "",
  showError: (message: string) => set({ isVisible: true, message }),
  hideError: () => set({ isVisible: false, message: "" }),
}));
