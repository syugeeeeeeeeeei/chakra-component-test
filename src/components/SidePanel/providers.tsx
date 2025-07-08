import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { DeletableContext, SelectionContext } from './contexts';
import type { SelectionMode, SidePanelItem } from './types';

// =================================================================
// Selection Provider
// =================================================================

interface SelectionProviderProps {
	children: ReactNode;
	defaultActiveIds?: string[];
	items: SidePanelItem[];
	defaultMode?: SelectionMode;
}

export function SelectionProvider({
	children,
	defaultActiveIds = [],
	items,
	defaultMode = 'multiple',
}: SelectionProviderProps) {
	const [activeItemIds, setActiveItemIds] = useState<string[]>(defaultActiveIds);

	const handleSelectItem = useCallback(
		(itemId: string, itemCategory: string | undefined, mode: SelectionMode) => {
			setActiveItemIds((prevIds) => {
				const isSelected = prevIds.includes(itemId);

				if (mode === 'single') {
					const otherCategoryIds = prevIds.filter(id => {
						const item = items.find(i => i.id === id);
						return item?.category !== itemCategory;
					});
					return isSelected ? otherCategoryIds : [...otherCategoryIds, itemId];
				}

				return isSelected ? prevIds.filter((id) => id !== itemId) : [...prevIds, itemId];
			});
		},
		[items]
	);

	const value = useMemo(
		() => ({ activeItemIds, handleSelectItem, defaultMode }),
		[activeItemIds, handleSelectItem, defaultMode]
	);

	return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

// =================================================================
// Deletable Provider
// =================================================================

interface DeletableProviderProps {
	children: ReactNode;
	onDeleteItem: (itemId: string) => void;
	dialogTitle?: string;
	dialogBody?: string;
	cancelButtonText?: string;
	confirmButtonText?: string;
}

export function DeletableProvider({
	children,
	onDeleteItem,
	dialogTitle = 'アイテムを削除',
	dialogBody = '本当にこのアイテムを削除しますか？この操作は元に戻せません。',
	cancelButtonText = 'キャンセル',
	confirmButtonText = '削除',
}: DeletableProviderProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [targetId, setTargetId] = useState<string | null>(null);
	const cancelRef = useRef(null);

	const openDeleteAlert = useCallback(
		(itemId: string) => {
			setTargetId(itemId);
			onOpen();
		},
		[onOpen]
	);

	const handleDeleteItem = useCallback(
		(itemId: string) => {
			onDeleteItem(itemId);
		},
		[onDeleteItem]
	);

	const handleConfirmDelete = useCallback(() => {
		if (targetId) {
			onDeleteItem(targetId);
		}
		onClose();
	}, [targetId, onDeleteItem, onClose]);

	const value = useMemo(
		() => ({ handleDeleteItem, openDeleteAlert }),
		[handleDeleteItem, openDeleteAlert]
	);

	return (
		<DeletableContext.Provider value={value}>
			{children}
			<AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef} isCentered>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>{dialogTitle}</AlertDialogHeader>
						<AlertDialogBody>{dialogBody}</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								{cancelButtonText}
							</Button>
							<Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
								{confirmButtonText}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</DeletableContext.Provider>
	);
}
