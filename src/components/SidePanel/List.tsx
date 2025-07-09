import { Box, Heading as ChakraHeading, VStack, type BoxProps, type HeadingProps as ChakraHeadingProps } from '@chakra-ui/react';
import React, { useMemo, type ReactNode } from 'react';
import { SectionContext } from './contexts';
import { useRoot, useSelection } from './hooks';
import type { SelectionMode, SidePanelItem } from './types';

// =================================================================
// Slot Components
// =================================================================
type RenderItemFunction = (item: SidePanelItem) => ReactNode;

interface EmptyProps { children: ReactNode; }
export function ListEmpty({ children }: EmptyProps) { return <>{children}</>; }
export function SectionEmpty({ children }: EmptyProps) { return <>{children}</>; }

// Contentコンポーネントはレンダリング関数をchildrenとして受け取る
interface ContentProps {
	children: RenderItemFunction;
}
export function Content({ children }: ContentProps) {
	// このコンポーネント自体は何もレンダリングせず、スロットとして機能する
	return null;
}
Content.displayName = "Section.Content";


// =================================================================
// List Header
// =================================================================
interface HeaderProps extends ChakraHeadingProps {
	children: ReactNode;
}
export function Header({ children, ...props }: HeaderProps) {
	return (
		<ChakraHeading size="sm" color="gray.600" mb={2} noOfLines={1} {...props}>
			{children}
		</ChakraHeading>
	);
}

// =================================================================
// List Section
// =================================================================
interface SectionProps extends BoxProps {
	children: ReactNode;
	category?: string;
	selectionMode?: SelectionMode;
	selectionEnabled?: boolean;
}

export function Section({ children, category, selectionMode, selectionEnabled = true, ...props }: SectionProps) {
	const { items } = useRoot();
	const selection = useSelection();

	if ((selectionMode !== undefined || !selectionEnabled) && !selection) {
		throw new Error(
			'selectionMode or selectionEnabled props cannot be used without a <SelectionProvider>.'
		);
	}

	const sectionItems = useMemo(() =>
		category ? items.filter(item => item.category === category) : [],
		[items, category]
	);

	const childrenArray = React.Children.toArray(children);
	const header = childrenArray.find(child => (child as React.ReactElement).type === Header);
	const emptyContent = childrenArray.find(child => (child as React.ReactElement).type === SectionEmpty);
	const contentComponent = childrenArray.find(child => (child as React.ReactElement).type === Content) as React.ReactElement<ContentProps> | undefined;
	const renderItem = contentComponent?.props.children;

	const contextValue = useMemo(() => ({ selectionMode, selectionEnabled }), [selectionMode, selectionEnabled]);

	return (
		<SectionContext.Provider value={contextValue}>
			<VStack align="stretch" w="100%" spacing={2} {...props}>
				{header}
				{sectionItems.length > 0 && renderItem
					? sectionItems.map(item => renderItem(item))
					: emptyContent || null}
			</VStack>
		</SectionContext.Provider>
	);
}


// =================================================================
// List Root
// =================================================================
interface ListProps {
	children: ReactNode;
}

export function List({ children }: ListProps) {
	const { isOpen, items } = useRoot();

	const childrenArray = React.Children.toArray(children);
	const emptyContent = childrenArray.find(child => (child as React.ReactElement).type === ListEmpty);
	const regularContent = childrenArray.filter(child => (child as React.ReactElement).type !== ListEmpty);

	if (!isOpen) {
		return null;
	}

	if (items.length === 0 && emptyContent) {
		return <Box flex="1">{emptyContent}</Box>;
	}

	return (
		<VStack as="section" flex="1" overflowY="auto" pr={2} overflowX="hidden" align="stretch" spacing={4}>
			{regularContent}
		</VStack>
	);
}
