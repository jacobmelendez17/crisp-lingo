import { create } from "zustand";

type DeleteModalState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useDeleteModal = create<DeleteModalState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}))