import { useDisclosure } from '@chakra-ui/react'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import { SidePanelContext, type SelectionMode, type SidePanelContextProps } from './context'
import type { SidePanelItem } from './types'

export function SidePanelProvider({
	children,
	defaultItems = [],
	selectionMode = 'multiple',
	defaultActiveItemId,
	defaultActiveItemIds
}: {
	children: ReactNode
	defaultItems?: SidePanelItem[]
	selectionMode?: SelectionMode
	defaultActiveItemId?: string
	defaultActiveItemIds?: string[]
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [isClickOpen, setIsClickOpen] = useState(false)
	const [items, setItems] = useState<SidePanelItem[]>(defaultItems)
	const [activeItemIds, setActiveItemIds] = useState<string[]>(() => {
		if (selectionMode === 'single') {
			return defaultActiveItemId ? [defaultActiveItemId] : []
		}
		return defaultActiveItemIds ?? []
	})
	const [searchQuery, setSearchQuery] = useState('')
	const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure()
	const [targetIdToDelete, setTargetIdToDelete] = useState<string | null>(null)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const timerRef = useRef<number | null>(null)
	const leaveTimerRef = useRef<number | null>(null)
	const isHoveringRef = useRef<boolean>(false)

	const clearOpenTimer = useCallback(() => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } }, [])
	const filteredItems = items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
	const onToggleOpen = useCallback((open: boolean) => { setIsOpen(open) }, [])
	const handleOpenClick = useCallback(() => { if (!isOpen) { setIsOpen(true); setIsClickOpen(true); } else if (isOpen && !isClickOpen) { setIsClickOpen(true); } else { setIsOpen(false); setIsClickOpen(false); setIsSearchOpen(false); setSearchQuery(''); } }, [isOpen, isClickOpen])

	const handleItemSelect = useCallback(
		(itemId: string, itemCategory: string | undefined, mode: SelectionMode) => {
			setActiveItemIds((prevIds) => {
				const isSelected = prevIds.includes(itemId)

				if (mode === 'single') {
					// Find IDs of items that are NOT in the current item's category
					const otherCategoryIds = prevIds.filter(id => {
						const item = items.find(i => i.id === id)
						return item?.category !== itemCategory
					})

					// If the clicked item is already selected, deselect it.
					// Otherwise, select it and keep other categories' selections.
					return isSelected ? otherCategoryIds : [...otherCategoryIds, itemId]
				}

				// Multiple mode logic (unchanged)
				return isSelected
					? prevIds.filter((id) => id !== itemId)
					: [...prevIds, itemId]
			})
		},
		[items] // Depends on `items` to find categories
	)

	const handleCreateItem = useCallback(
		(newItemData?: Partial<Omit<SidePanelItem, 'id'>>) => {
			const newId = `new-item-${Date.now()}`
			const newItem: SidePanelItem = { id: newId, title: `新しいアイテム ${items.length + 1}`, ...newItemData }
			setItems((prevItems) => [...prevItems, newItem])

			// Note: Creation logic is complex with per-section modes.
			// The `onCreate` should handle the selection logic if needed.
			// Here, we just add it based on the global mode for simplicity.
			setActiveItemIds((prevIds) => {
				if (selectionMode === 'single') {
					// In global single mode, deselect everything else
					return [newId]
				}
				// In global multiple mode, just add the new item
				return [...prevIds, newId]
			})
		},
		[items.length, selectionMode]
	)

	const handleDeleteItem = useCallback((itemId: string) => {
		setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
		setActiveItemIds((prevIds) => prevIds.filter((id) => id !== itemId))
	}, [])

	const onSearchQueryChange = useCallback((query: string) => { setSearchQuery(query) }, [])
	const handlePanelMouseEnter = useCallback(() => { isHoveringRef.current = true; if (leaveTimerRef.current !== null) clearTimeout(leaveTimerRef.current); clearOpenTimer(); timerRef.current = window.setTimeout(() => { if (isHoveringRef.current) setIsOpen(true) }, 200) }, [setIsOpen, clearOpenTimer])
	const handlePanelMouseLeave = useCallback(() => { isHoveringRef.current = false; clearOpenTimer(); leaveTimerRef.current = window.setTimeout(() => { if (!isClickOpen) { setIsOpen(false); setIsSearchOpen(false); onSearchQueryChange('') } }, 200) }, [isClickOpen, setIsOpen, setIsSearchOpen, onSearchQueryChange, clearOpenTimer])

	const value: SidePanelContextProps = {
		isOpen, isClickOpen, onToggleOpen, handleOpenClick, items, setItems, handleItemSelect, handleCreateItem, handleDeleteItem, selectionMode, activeItemIds, setActiveItemIds, searchQuery, isSearchOpen, setIsSearchOpen, onSearchQueryChange, filteredItems, isAlertOpen, onAlertOpen, onAlertClose, targetIdToDelete, setTargetIdToDelete, handlePanelMouseEnter, handlePanelMouseLeave, clearOpenTimer
	}
	return <SidePanelContext.Provider value={value}>{children}</SidePanelContext.Provider>
}
