import { useContext } from 'react';
import type { DeletableContextProps, ItemContextProps, RootContextProps, SectionContextProps, SelectionContextProps } from './contexts';
import {
	DeletableContext,
	ItemContext,
	RootContext,
	SectionContext,
	SelectionContext,
} from './contexts';


/**
 * コンポーネントが適切なProvider内で使用されているかを確認する汎用フック
 * @param context - React Contextオブジェクト
 * @param contextName - エラーメッセージに表示するContext名
 */
function useRequiredContext<T>(context: React.Context<T | null>, contextName: string): T {
	const contextValue = useContext(context);
	if (!contextValue) {
		throw new Error(`This component must be used within a <${contextName}>.`);
	}
	return contextValue;
}

// Core Hooks
export const useRoot = (): RootContextProps => useRequiredContext(RootContext, 'SidePanel');
export const useItem = (): ItemContextProps => useRequiredContext(ItemContext, 'SidePanel.Item');
export const useSection = (): SectionContextProps => useContext(SectionContext);

// Feature Plugin Hooks
export const useSelection = (): SelectionContextProps | null => useContext(SelectionContext);
export const useDeletable = (): DeletableContextProps | null => useContext(DeletableContext);
