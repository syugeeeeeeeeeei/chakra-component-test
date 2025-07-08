import { useMemo, type ReactNode } from 'react';
import { ItemContext } from './contexts.js';
import { useDeletable, useSelection } from './hooks.js';
import type { SidePanelItem } from './types.js';

interface ItemProps {
	item: SidePanelItem;
	children: ReactNode;
}

/**
 * UIを持たないヘッドレスコンポーネント。
 * アイテムに関する状態とロジックを計算し、Context経由で子要素に提供する。
 */
export function Item({ item, children }: ItemProps) {
	const selection = useSelection();
	const deletable = useDeletable();

	const isSelected = selection?.activeItemIds.includes(item.id) ?? false;

	const value = useMemo(() => {
		return {
			item,
			state: {
				isSelected,
			},
			props: {
				containerProps: {},
				triggerProps: {
					onClick: selection
						? () => selection.handleSelectItem(item.id, item.category, 'multiple') // モードはSectionから取得するよう拡張が必要
						: undefined,
					'aria-pressed': isSelected,
				},
				deleteButtonProps: deletable
					? {
						onClick: () => deletable.openDeleteAlert(item.id),
						'aria-label': `Delete ${item.title}`,
					}
					: undefined,
			},
		};
	}, [item, isSelected, selection, deletable]);

	return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
}
