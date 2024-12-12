import { create } from "zustand";

interface NetworkState {
  isConnected: boolean | null;
  setIsConnected: (status: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: null,
  setIsConnected: (status: boolean) => set({ isConnected: status }),
}));
