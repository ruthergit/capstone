// src/stores/useAuthTokenStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthTokenStore = {
  authToken: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
};

export const useAuthTokenStore = create<AuthTokenStore>()(
  persist(
    (set) => ({
      authToken: null,
      setToken: (token) => set({ authToken: token }),
      clearToken: () => set({ authToken: null }),
    }),
    {
      name: "auth-token-storage", // localStorage key
    }
  )
);
