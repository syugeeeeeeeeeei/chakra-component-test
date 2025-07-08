import type { ColorProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

// Chakra UIのカラープロパティの型をエイリアスとして定義
export type ChakraColor = ColorProps['color'];

/**
 * SidePanelコンポーネントの配色やスタイルを定義するProps
 */
export interface SidePanelStyleProps {
	/**
	 * パネル全体の背景色。Chakra UIのカラートークンが利用可能です。
	 * @example 'white', 'gray.800', { base: 'gray.50', md: 'gray.100' }
	 * @default 'white'
	 */
	panelBgColor: ChakraColor;

	/**
	 * 基本的なテキストの色。Chakra UIのカラートークンが利用可能です。
	 * @example 'gray.700', 'whiteAlpha.900'
	 * @default 'gray.700'
	 */
	textColor: ChakraColor;

	/**
	 * 強調色（検索バーの枠線など）。Chakra UIのカラートークンが利用可能です。
	 * @example 'teal.500', 'purple.400'
	 * @default 'teal.500'
	 */
	accentColor: ChakraColor;

	/**
	 * プライマリボタンやアクティブなアイテムの背景色。Chakra UIのカラートークンが利用可能です。
	 * @example 'blue.400'
	 * @default 'blue.400'
	 */
	primaryButtonColor: ChakraColor;

	/**
	 * プライマリボタンやアクティブなアイテムのホバー時の背景色。Chakra UIのカラートークンが利用可能です。
	 * @example 'blue.600'
	 * @default 'blue.600'
	 */
	hoverAccentColor: ChakraColor;

	/**
	 * 検索バーの背景色。Chakra UIのカラートークンが利用可能です。
	 * @example 'gray.50', 'whiteAlpha.200'
	 * @default 'gray.50'
	 */
	searchBarBgColor: ChakraColor;

	/**
	 * リストアイテムのホバー時の背景色。Chakra UIのカラートークンが利用可能です。
	 * @example 'gray.200', 'whiteAlpha.300'
	 * @default 'gray.200'
	 */
	itemHoverBgColor: ChakraColor;

	/**
	 * 削除ボタンのChakra UIカラースキーム。
	 * これは単一の色ではなく、'blue'や'red'といったカラースキーム名を指定します。
	 * @example 'orange', 'red'
	 * @default 'orange'
	 */
	deleteButtonColorScheme: string;
}


export interface SidePanelItem {
	id: string;
	title: string;
	category?: string;
	[key: string]: unknown;
}

export interface SidePanelRootProps extends Partial<SidePanelStyleProps> {
	children: ReactNode;
	defaultItems?: SidePanelItem[];
	selectionMode?: 'single' | 'multiple';
	defaultActiveItemId?: string; // for single selection mode
	defaultActiveItemIds?: string[]; // for multiple selection mode
}
