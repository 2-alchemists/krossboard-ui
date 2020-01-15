import { createContext, useContext } from 'react'

import { KoaStore } from "./KoaStore"

export const StoreContext = createContext<KoaStore>({} as KoaStore)
export const StoreProvider = StoreContext.Provider

export const useStore = (): KoaStore => useContext(StoreContext)