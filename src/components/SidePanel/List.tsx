import { Heading as ChakraHeading, VStack, type BoxProps, type HeadingProps as ChakraHeadingProps } from '@chakra-ui/react';
import { useMemo, type ReactNode } from 'react';
import { SectionContext } from './contexts';
import { useRoot, useSelection } from './hooks';
import type { SelectionMode } from './types';

// =================================================================
// List Header (旧Heading)
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
	selectionMode?: SelectionMode;
	selectionEnabled?: boolean;
}

export function Section({ children, selectionMode, selectionEnabled = true, ...props }: SectionProps) {
	const selection = useSelection();

	if ((selectionMode !== undefined || !selectionEnabled) && !selection) {
		throw new Error(
			'selectionMode or selectionEnabled props cannot be used without a <SelectionProvider>.'
		);
	}

	const contextValue = useMemo(() => ({ selectionMode }), [selectionMode]);

	return (
		<SectionContext.Provider value={contextValue}>
			<VStack align="stretch" w="100%" spacing={2} {...props}>
				{children}
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
	const { isOpen } = useRoot();

	if (!isOpen) {
		return null;
	}

	return (
		<VStack as="section" flex="1" overflowY="auto" pr={2} overflowX="hidden" align="stretch" spacing={4}>
			{children}
		</VStack>
	);
}
