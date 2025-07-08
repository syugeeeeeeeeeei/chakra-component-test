import { useMemo, type ReactNode } from 'react';
import { ItemContext } from './contexts';
import { useDeletable, useSection, useSelection } from './hooks';
import type { SidePanelItem } from './types';

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
	const section = useSection(); // SectionContextからselectionEnabledを取得するために追加

	const isSelected = selection?.activeItemIds.includes(item.id) ?? false;

	// セクションのselectionEnabledプロパティを考慮
	const isSelectionEnabledInThisSection = section.selectionEnabled;

	const effectiveSelectionMode = section.selectionMode || selection?.defaultMode || 'multiple';

	const value = useMemo(() => {
		return {
			item,
			state: {
				isSelected,
			},
			props: {
				containerProps: {},
				triggerProps: {
					// isSelectionEnabledInThisSection が true の場合のみ onClick を設定
					onClick:
						selection && isSelectionEnabledInThisSection
							? () => selection.handleSelectItem(item.id, item.category, effectiveSelectionMode)
							: undefined,
					'aria-pressed': isSelected,
					'data-selection-enabled': isSelectionEnabledInThisSection, // デバッグ用に属性を追加
				},
				deleteButtonProps: deletable
					? {
						onClick: () => deletable.openDeleteAlert(item.id),
						'aria-label': `Delete ${item.title}`,
					}
					: undefined,
			},
		};
	}, [item, isSelected, selection, deletable, effectiveSelectionMode, isSelectionEnabledInThisSection]); // 依存配列に追加

	return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
}

