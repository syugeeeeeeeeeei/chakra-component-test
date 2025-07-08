import { createContext, type Dispatch, type RefObject, type SetStateAction } from 'react';
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
	isToggleButtonHoveredRef: RefObject<boolean>;
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
		triggerProps: { onClick?: () => void; 'aria-pressed': boolean; 'data-selection-enabled': boolean }; // data-selection-enabled を追加
		deleteButtonProps?: { onClick: () => void; 'aria-label': string };
	};
}
export const ItemContext = createContext<ItemContextProps | null>(null);

// =================================================================
// Section Context
// =================================================================
export interface SectionContextProps {
	selectionMode?: SelectionMode;
	selectionEnabled: boolean; // selectionEnabled を追加
}
export const SectionContext = createContext<SectionContextProps>({ selectionEnabled: true }); // デフォルト値を設定


// =================================================================
// Feature Plugin Contexts
// =================================================================
export interface SelectionContextProps {
	activeItemIds: string[];
	handleSelectItem: (itemId: string, itemCategory: string | undefined, mode: SelectionMode) => void;
	defaultMode: SelectionMode; // グローバルな選択モード
}
export const SelectionContext = createContext<SelectionContextProps | null>(null);

export interface DeletableContextProps {
	handleDeleteItem: (itemId: string) => void;
	openDeleteAlert: (itemId: string) => void;
}
export const DeletableContext = createContext<DeletableContextProps | null>(null);

