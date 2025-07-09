import { useContext } from 'react';
import type { DeletableContextProps, ItemContextProps, RootContextProps, SearchContextProps, SectionContextProps, SelectionContextProps } from './contexts';
import {
	DeletableContext,
	ItemContext,
	RootContext,
	SearchContext,
	SectionContext,
	SelectionContext,
} from './contexts';


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
export const useSearch = (): SearchContextProps | null => useContext(SearchContext);