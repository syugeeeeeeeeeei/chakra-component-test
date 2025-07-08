import type { ColorProps } from '@chakra-ui/react';

// Chakra UIのカラープロパティの型
export type ChakraColor = ColorProps['color'];

// サイドパネルのアイテムを表す基本的なデータ構造
// [key: string]: unknown; により、利用者は自由に追加のプロパティを持たせることが可能
export interface SidePanelItem {
	id: string;
	title: string;
	category?: string;
	[key: string]: unknown;
}

// 選択モードの型
export type SelectionMode = 'single' | 'multiple';

// スタイリング関連のProps
export interface SidePanelStyleProps {
	panelBgColor?: ChakraColor;
	textColor?: ChakraColor;
	accentColor?: ChakraColor;
	primaryButtonColor?: ChakraColor;
	hoverAccentColor?: ChakraColor;
	searchBarBgColor?: ChakraColor;
	itemHoverBgColor?: ChakraColor;
	deleteButtonColorScheme?: string;
}
