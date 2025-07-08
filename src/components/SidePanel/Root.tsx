import { Box, VStack } from '@chakra-ui/react';
import React, { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { RootContext } from './contexts';
import type { SidePanelItem, SidePanelStyleProps } from './types';

interface PanelContainerProps {
	children: ReactNode;
	isOpen: boolean;
	panelBgColor: string;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
}

const PanelContainer = React.memo(
	({ children, isOpen, panelBgColor, onMouseEnter, onMouseLeave }: PanelContainerProps) => {
		return (
			<Box
				as="aside"
				w={isOpen ? '280px' : '74px'}
				h="100vh"
				bg={panelBgColor}
				p={4}
				boxShadow="lg"
				zIndex={10}
				transition="width 0.2s ease-in-out"
				flexShrink={0}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				<VStack align="stretch" spacing={4} h="100%">
					{children}
				</VStack>
			</Box>
		);
	}
);
PanelContainer.displayName = 'PanelContainer';


interface RootProps {
	children: ReactNode;
	defaultItems?: SidePanelItem[];
	styles?: SidePanelStyleProps;
}

export function Root({ children, defaultItems = [], styles: styleProps = {} }: RootProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isClickOpen, setIsClickOpen] = useState(false);
	const [items, setItems] = useState<SidePanelItem[]>(defaultItems);

	const timerRef = useRef<number | null>(null);
	const leaveTimerRef = useRef<number | null>(null);
	const isHoveringRef = useRef<boolean>(false);
	const isToggleButtonHoveredRef = useRef<boolean>(false); // ボタンホバー状態を管理

	const styles = useMemo<Required<SidePanelStyleProps>>(() => ({
		panelBgColor: styleProps.panelBgColor ?? 'white',
		textColor: styleProps.textColor ?? 'gray.700',
		accentColor: styleProps.accentColor ?? 'teal.500',
		primaryButtonColor: styleProps.primaryButtonColor ?? 'blue.400',
		hoverAccentColor: styleProps.hoverAccentColor ?? 'blue.600',
		searchBarBgColor: styleProps.searchBarBgColor ?? 'gray.50',
		itemHoverBgColor: styleProps.itemHoverBgColor ?? 'gray.200',
		deleteButtonColorScheme: styleProps.deleteButtonColorScheme ?? 'red',
	}), [styleProps]);

	const clearOpenTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const handleOpenClick = useCallback(() => {
		if (!isOpen) {
			setIsOpen(true);
			setIsClickOpen(true);
		} else if (isOpen && !isClickOpen) {
			setIsClickOpen(true);
		} else {
			setIsOpen(false);
			setIsClickOpen(false);
		}
	}, [isOpen, isClickOpen]);

	const handlePanelMouseEnter = useCallback(() => {
		isHoveringRef.current = true;
		if (leaveTimerRef.current !== null) clearTimeout(leaveTimerRef.current);
		clearOpenTimer();
		timerRef.current = window.setTimeout(() => {
			// ボタンがホバーされていない場合のみパネルを開く
			if (isHoveringRef.current && !isToggleButtonHoveredRef.current) {
				setIsOpen(true);
			}
		}, 250);
	}, [clearOpenTimer]);

	const handlePanelMouseLeave = useCallback(() => {
		isHoveringRef.current = false;
		clearOpenTimer();
		leaveTimerRef.current = window.setTimeout(() => {
			if (!isClickOpen) {
				setIsOpen(false);
			}
		}, 200);
	}, [isClickOpen, clearOpenTimer]);

	const value = useMemo(
		() => ({
			isOpen,
			isClickOpen,
			handleOpenClick,
			handlePanelMouseEnter,
			handlePanelMouseLeave,
			isToggleButtonHoveredRef, // Contextにrefを渡す
			items,
			setItems,
			styles
		}),
		[isOpen, isClickOpen, handleOpenClick, handlePanelMouseEnter, handlePanelMouseLeave, items, styles]
	);

	return (
		<RootContext.Provider value={value}>
			<PanelContainer
				isOpen={isOpen}
				panelBgColor={styles.panelBgColor as string}
				onMouseEnter={handlePanelMouseEnter}
				onMouseLeave={handlePanelMouseLeave}
			>
				{children}
			</PanelContainer>
		</RootContext.Provider>
	);
}
