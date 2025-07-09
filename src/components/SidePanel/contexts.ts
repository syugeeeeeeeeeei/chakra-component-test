import { createContext, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import type { SelectionMode, SidePanelItem, SidePanelStyleProps } from './types';

// =================================================================
// Core Context
// =================================================================
export interface RootContextProps {
	isOpen: boolean;
	isClickOpen: boolean;
	handleOpenClick: () => void;
	handlePanelMouseEnter: () => void;
	handlePanelMouseLeave: () => void;
	isToggleButtonHoveredRef: MutableRefObject<boolean>;
	items: SidePanelItem[];
	setItems: Dispatch<SetStateAction<SidePanelItem[]>>;
	styles: Required<SidePanelStyleProps>;
}
export const RootContext = createContext<RootContextProps | null>(null);

// =================================================================
// Item Context (Headless)
// =================================================================
export interface ItemContextProps {
	item: SidePanelItem;
	state: { isSelected: boolean };
	props: {
		containerProps: Record<string, unknown>;
		triggerProps: { onClick?: () => void; 'aria-pressed': boolean };
		deleteButtonProps?: { onClick: () => void; 'aria-label': string };
	};
}
export const ItemContext = createContext<ItemContextProps | null>(null);

// =================================================================
// Section Context
// =================================================================
export interface SectionContextProps {
	selectionMode?: SelectionMode;
}
export const SectionContext = createContext<SectionContextProps>({});


// =================================================================
// Feature Plugin Contexts
// =================================================================
export interface SelectionContextProps {
	activeItemIds: string[];
	handleSelectItem: (itemId: string, itemCategory: string | undefined, mode: SelectionMode) => void;
	defaultMode: SelectionMode;
}
export const SelectionContext = createContext<SelectionContextProps | null>(null);

export interface DeletableContextProps {
	handleDeleteItem: (itemId: string) => void;
	openDeleteAlert: (itemId: string) => void;
}
export const DeletableContext = createContext<DeletableContextProps | null>(null);

export interface SearchContextProps {
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
	isSearchOpen: boolean;
	setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
}
export const SearchContext = createContext<SearchContextProps | null>(null);