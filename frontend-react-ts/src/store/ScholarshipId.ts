import { create } from "zustand";

interface IdStore {
  id: number | null;
  setId: (value: number | null) => void;
}

export const useIdStore = create<IdStore>((set) => ({
  id: null,
  setId: (id) => set({ id }),
}));