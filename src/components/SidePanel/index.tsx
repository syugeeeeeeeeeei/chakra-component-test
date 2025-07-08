import {
	AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Divider, Flex, HStack, IconButton, Input, Spacer, Text, Tooltip, VStack, type BoxProps, type TextProps
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useContext, useRef, type ReactNode } from 'react';
import { FaAngleLeft, FaAngleRight, FaBars, FaPlus, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import { SectionContext, type SelectionMode } from './context';
import { useSidePanel } from './hooks';
import { SidePanelProvider } from './provider';
import type { ChakraColor, SidePanelItem, SidePanelRootProps, SidePanelStyleProps } from './types';

const MotionButton = motion.create(Button)
export type { ChakraColor, SidePanelItem, SidePanelRootProps, SidePanelStyleProps } from './types';

const Header = ({ showSearch = true, ...styleProps }: { showSearch?: boolean } & Partial<SidePanelStyleProps>) => {
	const { isOpen, isClickOpen, handleOpenClick, searchQuery, isSearchOpen, setIsSearchOpen, onSearchQueryChange, clearOpenTimer } = useSidePanel()
	const { textColor = 'gray.600', accentColor = 'teal.500', searchBarBgColor = 'gray.100' } = styleProps
	const searchInputRef = useRef<HTMLInputElement>(null)
	const handleIconButtonMouseEnter = useCallback((e: React.MouseEvent) => { e.stopPropagation(); clearOpenTimer() }, [clearOpenTimer])
	const handleIconButtonMouseLeave = useCallback((e: React.MouseEvent) => { e.stopPropagation() }, [])
	const handleSearchClick = useCallback(() => { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50) }, [setIsSearchOpen])
	const handleClearSearch = useCallback(() => { onSearchQueryChange(''); setIsSearchOpen(false) }, [onSearchQueryChange, setIsSearchOpen])
	const handleSearchBlur = useCallback(() => { setTimeout(() => { if (searchQuery === '') setIsSearchOpen(false) }, 100) }, [searchQuery, setIsSearchOpen])
	const panelToggleButtonIcon = isOpen && isClickOpen ? <FaBars /> : isOpen ? <FaAngleLeft /> : <FaAngleRight />
	const panelToggleButtonTooltip = isOpen && isClickOpen ? '固定解除して閉じる' : isOpen ? '固定する' : '開く'
	return (
		<HStack h={'42px'} justifyContent="flex-start" alignItems="center">
			<Tooltip label={panelToggleButtonTooltip} placement="right"><IconButton aria-label="Toggle Panel" icon={panelToggleButtonIcon} variant="ghost" onClick={handleOpenClick} onMouseEnter={handleIconButtonMouseEnter} onMouseLeave={handleIconButtonMouseLeave} /></Tooltip>
			{isOpen && showSearch && (
				<Flex flex="1" justifyContent="flex-end" alignItems="center" overflow="hidden">
					<motion.div layout initial={false} animate={{ width: isSearchOpen ? '100%' : '32px' }} transition={{ duration: 0.2, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
						<HStack spacing={isSearchOpen ? 2 : 0} bg={searchBarBgColor} borderRadius="full" pl={isSearchOpen ? 2 : 0} pr={isSearchOpen ? 1 : 0} py={isSearchOpen ? 1 : 0} border={isSearchOpen ? '1px solid' : 'none'} borderColor={accentColor} cursor={!isSearchOpen ? 'pointer' : 'default'} onClick={!isSearchOpen ? handleSearchClick : undefined} w="100%">
							<IconButton aria-label="Search Items" icon={<FaSearch />} variant="ghost" size="sm" onClick={isSearchOpen ? undefined : handleSearchClick} pointerEvents={isSearchOpen ? 'none' : 'auto'} _hover={{ bg: 'transparent' }} _active={{ bg: 'transparent' }} />
							<AnimatePresence>{isSearchOpen && (<motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '100%', opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden', flexGrow: 1 }}><Input ref={searchInputRef} placeholder="検索..." size="md" value={searchQuery} onChange={(e) => onSearchQueryChange(e.target.value)} variant="unstyled" flex="1" h="auto" onBlur={handleSearchBlur} color={textColor} /></motion.div>)}</AnimatePresence>
							<AnimatePresence>{isSearchOpen && searchQuery && (<motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}><IconButton aria-label="Clear Search" icon={<FaTimes />} size="xs" variant="ghost" onClick={handleClearSearch} /></motion.div>)}</AnimatePresence>
						</HStack>
					</motion.div>
				</Flex>
			)}
		</HStack>
	)
}

const CreateButton = ({ createButtonText = '新規作成', defaultItem, ...styleProps }: { createButtonText?: string; defaultItem?: Partial<Omit<SidePanelItem, 'id'>>; } & Partial<SidePanelStyleProps>) => {
	const { isOpen, handleCreateItem } = useSidePanel();
	const { primaryButtonColor = 'blue.400', hoverAccentColor = 'blue.600' } = styleProps;
	const handleClick = () => { handleCreateItem(defaultItem) };
	return (<Tooltip label={!isOpen ? createButtonText : undefined} isDisabled={isOpen} placement="right"><MotionButton bg={primaryButtonColor} color="white" onClick={handleClick} justifyContent="flex-start" _hover={{ bg: hoverAccentColor }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} w="100%"><FaPlus />{isOpen && (<Text ml={3} noOfLines={1}>{createButtonText}</Text>)}</MotionButton></Tooltip>)
}

const ListRoot = ({ children }: { children: ReactNode }) => {
	const { isOpen } = useSidePanel();
	if (!isOpen) return null;
	return (<VStack as="section" flex="1" overflowY="auto" pr={2} overflowX="hidden" align="stretch" spacing={4}>{children}</VStack>)
}

interface ListSectionProps extends BoxProps {
	children: ReactNode;
	selectionMode?: SelectionMode;
	isDeletable?: boolean;
}

const ListSection = ({ children, selectionMode, isDeletable = true, ...props }: ListSectionProps) => {
	return (
		<SectionContext.Provider value={{ selectionMode, isDeletable }}>
			<VStack align="stretch" w="100%" spacing={2} {...props}>
				{children}
			</VStack>
		</SectionContext.Provider>
	)
}

interface ListHeaderProps extends TextProps {
	children: ReactNode;
	onCreate?: () => void;
}

const ListHeader = ({ children, onCreate, ...props }: ListHeaderProps) => {
	return (<HStack w="100%"><Text fontSize="md" fontWeight="bold" noOfLines={1} color="gray.700" {...props}>{children}</Text><Spacer />{onCreate && (<Tooltip label="新規作成" placement="top"><IconButton aria-label="Create new item in this section" icon={<FaPlus />} size="sm" variant="ghost" onClick={onCreate} /></Tooltip>)}</HStack>)
}

const ListContent = ({ children, ...props }: BoxProps) => {
	return <VStack align="stretch" w="100%" spacing={1} {...props}>{children}</VStack>
}

const ListItem = ({ item, showDeleteButton = true, ...styleProps }: { item: SidePanelItem; showDeleteButton?: boolean } & Partial<SidePanelStyleProps>) => {
	const { activeItemIds, handleItemSelect, onAlertOpen, setTargetIdToDelete, selectionMode: globalSelectionMode } = useSidePanel()
	const sectionContext = useContext(SectionContext)
	const effectiveSelectionMode = sectionContext?.selectionMode || globalSelectionMode
	const isSectionDeletable = sectionContext?.isDeletable ?? true

	const { textColor = 'gray.600', primaryButtonColor = 'blue.400', hoverAccentColor = 'blue.600', itemHoverBgColor = 'gray.200', deleteButtonColorScheme = 'red' } = styleProps
	const isActive = activeItemIds.includes(item.id)
	const handleDeleteClick = (e: React.MouseEvent) => { e.stopPropagation(); setTargetIdToDelete(item.id); onAlertOpen(); }
	const handleSelect = () => { handleItemSelect(item.id, item.category, effectiveSelectionMode) }
	const finalShowDeleteButton = isSectionDeletable && showDeleteButton

	return (
		<HStack key={item.id} w="100%">
			<MotionButton variant={isActive ? 'solid' : 'ghost'} bg={isActive ? primaryButtonColor : 'transparent'} color={isActive ? 'white' : textColor} flex="1" justifyContent="flex-start" onClick={handleSelect} _hover={{ bg: isActive ? hoverAccentColor : itemHoverBgColor }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} size="sm">
				<Text noOfLines={1} fontSize="sm">{item.title}</Text>
			</MotionButton>
			{finalShowDeleteButton && (<IconButton aria-label={`Delete ${item.title}`} icon={<FaTrash />} variant="ghost" colorScheme={deleteButtonColorScheme} size="sm" onClick={handleDeleteClick} />)}
		</HStack>
	)
}

const List = Object.assign(ListRoot, {
	Section: ListSection,
	Header: ListHeader,
	Content: ListContent,
	Item: ListItem
})

const Footer = ({ children }: { children: ReactNode }) => {
	const { isOpen } = useSidePanel();
	if (!isOpen || !children) return null;
	return (<><Divider /><Box pt={2}>{children}</Box></>);
}

const DeleteConfirmationDialog = () => {
	const { isAlertOpen, onAlertClose, targetIdToDelete, handleDeleteItem } = useSidePanel();
	const cancelRef = useRef<HTMLButtonElement>(null);
	const confirmDelete = () => { if (targetIdToDelete) { handleDeleteItem(targetIdToDelete); } onAlertClose(); };
	return (<AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose} isCentered><AlertDialogOverlay><AlertDialogContent><AlertDialogHeader fontSize="lg" fontWeight="bold">アイテムを削除</AlertDialogHeader><AlertDialogBody>本当にこのアイテムを削除しますか？この操作は元に戻せません。</AlertDialogBody><AlertDialogFooter><Button ref={cancelRef} onClick={onAlertClose}>キャンセル</Button><Button colorScheme="red" onClick={confirmDelete} ml={3}>削除</Button></AlertDialogFooter></AlertDialogContent></AlertDialogOverlay></AlertDialog>)
}

const PanelContainer = ({ children, panelBgColor }: { children: ReactNode; panelBgColor?: ChakraColor }) => {
	const { isOpen, handlePanelMouseEnter, handlePanelMouseLeave } = useSidePanel();
	return (<Box w={isOpen ? '280px' : '74px'} h="100vh" bg={panelBgColor} p={4} boxShadow="lg" zIndex={10} transition="width 0.2s ease-in-out" flexShrink={0} onMouseEnter={handlePanelMouseEnter} onMouseLeave={handlePanelMouseLeave}><VStack align="stretch" spacing={4} h="100%">{children}</VStack></Box>)
}

const Root = ({ children, defaultItems, selectionMode, defaultActiveItemId, defaultActiveItemIds, ...styleProps }: SidePanelRootProps) => {
	return (
		<SidePanelProvider defaultItems={defaultItems} selectionMode={selectionMode} defaultActiveItemId={defaultActiveItemId} defaultActiveItemIds={defaultActiveItemIds}>
			<PanelContainer panelBgColor={styleProps.panelBgColor}>{children}</PanelContainer>
			<DeleteConfirmationDialog />
		</SidePanelProvider>
	)
}

export const SidePanel = Object.assign(Root, {
	Header,
	CreateButton,
	List,
	Footer
})