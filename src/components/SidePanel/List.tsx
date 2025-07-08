import { VStack, type BoxProps } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { useRoot, useSelection } from './hooks.js';
import type { SelectionMode } from './types.js';

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

	// Providerがないのにselection関連のpropが指定されたらエラーを投げる
	if ((selectionMode || selectionEnabled === false) && !selection) {
		throw new Error(
			'selectionMode or selectionEnabled props cannot be used without a <SelectionProvider>.'
		);
	}

	// このコンポーネントは現在、主にエラーチェックと将来の拡張性のために存在します。
	// Contextを使ってセクションごとの状態を配下に渡すことも可能です。
	return (
		<VStack align="stretch" w="100%" spacing={2} {...props}>
			{children}
		</VStack>
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
		<VStack as="section" flex="1" w={"100%"} overflowY="auto" pr={2} overflowX="hidden" align="stretch" spacing={4}>
			{children}
		</VStack>
	);
}
