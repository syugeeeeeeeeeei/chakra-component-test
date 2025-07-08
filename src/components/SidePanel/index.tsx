import { Header as HeaderComponent } from './Header.js';
import { Item as ItemComponent } from './Item.js';
import { List as ListComponent, Section as SectionComponent } from './List.js';
import { DeleteButton, ItemText, Trigger } from './primitives';
import { Root as RootComponent } from './Root.js';
import type { ChakraColor, SelectionMode, SidePanelItem, SidePanelStyleProps } from './types.js';

// 型定義のエクスポート
export type { ChakraColor, SelectionMode, SidePanelItem, SidePanelStyleProps };

// 機能Providerのエクスポート
	export { DeletableProvider, SelectionProvider } from './providers';

// =================================================================
// コンポーネントの組み立て
// =================================================================

const Item = Object.assign(ItemComponent, {
	Text: ItemText,
	Trigger: Trigger,
	DeleteButton: DeleteButton,
});

const List = Object.assign(ListComponent, {
	Section: SectionComponent,
	Item: Item,
});

export const SidePanel = Object.assign(RootComponent, {
	Header: HeaderComponent,
	List: List,
	// Footerなどもここに追加可能
});
