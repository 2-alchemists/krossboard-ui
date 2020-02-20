import { createContext, useContext } from 'react'

import { KoaStore } from './KoaStore'

interface IStore {
    koaStore: KoaStore
}

export const StoreContext = createContext<IStore>({} as IStore)
export const StoreProvider = StoreContext.Provider

export const useStore = (): KoaStore => useContext(StoreContext).koaStore