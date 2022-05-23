/*
  Copyright (C) 2020  2ALCHEMISTS SAS.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/

import { createContext, useContext } from 'react'

import { KoaStore } from './KoaStore'

interface IStore {
    koaStore: KoaStore
}

export const StoreContext = createContext<IStore>({} as IStore)
export const StoreProvider = StoreContext.Provider

export const useStore = (): KoaStore => useContext(StoreContext).koaStore
