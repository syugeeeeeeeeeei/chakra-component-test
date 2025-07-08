import { Header as HeaderComponent } from './Header';
import { Item as ItemComponent } from './Item';
import { List as ListComponent, Header as ListHeaderComponent, Section as SectionComponent } from './List';
import { DeleteButton, ItemText, Trigger } from './primitives';
import { Root as RootComponent } from './Root';
import type { ChakraColor, SelectionMode, SidePanelItem, SidePanelStyleProps } from './types';

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
	Header: ListHeaderComponent, // HeadingからHeaderに変更
	Item: Item,
});

export const SidePanel = Object.assign(RootComponent, {
	Header: HeaderComponent,
	List: List,
	// Footerなどもここに追加可能
});
