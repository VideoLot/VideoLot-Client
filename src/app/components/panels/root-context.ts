import { createContext } from 'react';

export type PanelDeleteCallback = ((id: string) => void) | null;

export interface RootContextData {
    deletePanel: PanelDeleteCallback
    restorePanel: PanelDeleteCallback
}

export const RootPanelContext = createContext({
    deletePanel: null,
    restorePanel: null
} as RootContextData);