// src/components/SidePanel/hooks.ts
import { useContext } from 'react'
import { SidePanelContext, type SidePanelContextProps } from './context'

export const useSidePanel = (): SidePanelContextProps => {
	const context = useContext(SidePanelContext)
	if (!context) {
		throw new Error('useSidePanel must be used within a SidePanelProvider')
	}
	return context
}