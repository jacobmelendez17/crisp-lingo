import { create } from 'zustand';

export type DangerActionType =
	| 'reset_vocab'
	| 'reset_grammar'
	| 'reset_account'
	| 'delete_account';

type DeleteModalState = {
	isOpen: boolean;
	action: DangerActionType | null;

	open: (action: DangerActionType) => void;
	close: () => void;
};

export const useDeleteModal = create<DeleteModalState>((set) => ({
	isOpen: false,
	action: null,

	open: (action) => set({ isOpen: true, action }),
	close: () => set({ isOpen: false, action: null })
}));
