import { createContext } from 'react'
import type { SidePanelItem } from './types'

export type SelectionMode = 'single' | 'multiple'

// Section-specific context to override the global selection mode and deletable flag
export interface SectionContextProps {
	selectionMode?: SelectionMode
	isDeletable?: boolean
}

export const SectionContext = createContext<SectionContextProps | undefined>(undefined)


// Main context for the whole side panel
export interface SidePanelContextProps {
	// Panel State
	isOpen: boolean
	isClickOpen: boolean
	onToggleOpen: (open: boolean) => void
	handleOpenClick: () => void

	// Item State
	items: SidePanelItem[]
	setItems: React.Dispatch<React.SetStateAction<SidePanelItem[]>>
	handleCreateItem: <T extends string>(newItemData?: Partial<Omit<SidePanelItem, 'id'> & { category: T }>) => void
	handleDeleteItem: (itemId: string) => void

	// Selection State
	selectionMode: SelectionMode
	activeItemIds: string[]
	setActiveItemIds: React.Dispatch<React.SetStateAction<string[]>>
	handleItemSelect: (
		itemId: string,
		itemCategory: string | undefined,
		mode: SelectionMode
	) => void

	// Search State
	searchQuery: string
	isSearchOpen: boolean
	setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
	onSearchQueryChange: (query: string) => void
	filteredItems: SidePanelItem[]

	// Disclosure for Delete Alert
	isAlertOpen: boolean
	onAlertOpen: () => void
	onAlertClose: () => void
	targetIdToDelete: string | null
	setTargetIdToDelete: React.Dispatch<React.SetStateAction<string | null>>

	// Hover-open logic
	handlePanelMouseEnter: () => void
	handlePanelMouseLeave: () => void
	clearOpenTimer: () => void
}

export const SidePanelContext = createContext<SidePanelContextProps | undefined>(undefined)