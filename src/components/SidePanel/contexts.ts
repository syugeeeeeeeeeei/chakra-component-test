import { createContext, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import type { SelectionMode, SidePanelItem, SidePanelStyleProps } from './types';

// =================================================================
// Core Context
// =================================================================

/**
 * パネル全体のコアな状態を管理するContext
 */
export interface RootContextProps {
	// Panel State
	isOpen: boolean;
	isClickOpen: boolean;
	handleOpenClick: () => void;
	handlePanelMouseEnter: () => void;
	handlePanelMouseLeave: () => void;
	isToggleButtonHoveredRef: MutableRefObject<boolean>; // ボタンのホバー状態を追跡するref

	// Item State
	items: SidePanelItem[];
	setItems: Dispatch<SetStateAction<SidePanelItem[]>>;

	// Style Props
	styles: Required<SidePanelStyleProps>;
}

export const RootContext = createContext<RootContextProps | null>(null);

// =================================================================
// Item Context (Headless)
// =================================================================

/**
 * 単一アイテムの状態とロジックを提供するヘッドレスなContext
 */
export interface ItemContextProps {
	item: SidePanelItem;
	state: {
		isSelected: boolean;
		// isPinned, isDeletable... etc.
	};
	props: {
		containerProps: Record<string, unknown>;
		triggerProps: {
			onClick?: () => void;
			'aria-pressed': boolean;
		};
		deleteButtonProps?: {
			onClick: () => void;
			'aria-label': string;
		};
	};
}

export const ItemContext = createContext<ItemContextProps | null>(null);

// =================================================================
// Feature Plugin Contexts
// =================================================================

/**
 * 選択機能を提供するContext
 */
export interface SelectionContextProps {
	activeItemIds: string[];
	handleSelectItem: (itemId: string, itemCategory: string | undefined, mode: SelectionMode) => void;
}

export const SelectionContext = createContext<SelectionContextProps | null>(null);

/**
 * 削除機能を提供するContext
 */
export interface DeletableContextProps {
	handleDeleteItem: (itemId: string) => void;
	openDeleteAlert: (itemId: string) => void;
}

export const DeletableContext = createContext<DeletableContextProps | null>(null);
