import { Header as HeaderComponent } from './Header';
import { Item as ItemComponent } from './Item';
import { List as ListComponent, ListEmpty, Header as ListHeaderComponent, Section as SectionComponent, Content as SectionContentComponent, SectionEmpty } from './List';
import { DeleteButton, ItemText, Trigger } from './primitives';
import { Root as RootComponent } from './Root';
import type { ChakraColor, SelectionMode, SidePanelItem, SidePanelStyleProps } from './types';

// 型定義のエクスポート
export type { ChakraColor, SelectionMode, SidePanelItem, SidePanelStyleProps };

// 機能Providerのエクスポート
	export { DeletableProvider, SearchProvider, SelectionProvider } from './providers';

// =================================================================
// コンポーネントの組み立て
// =================================================================

const Item = Object.assign(ItemComponent, {
	Text: ItemText,
	Trigger: Trigger,
	DeleteButton: DeleteButton,
});

// ★修正点: SectionにHeaderを組み込む
const Section = Object.assign(SectionComponent, {
	Header: ListHeaderComponent,
	Empty: SectionEmpty,
	Content: SectionContentComponent,
});

// ★修正点: ListからHeaderを削除
const List = Object.assign(ListComponent, {
	Section: Section,
	Item: Item,
	Empty: ListEmpty,
});

export const SidePanel = Object.assign(RootComponent, {
	Header: HeaderComponent,
	List: List,
});
