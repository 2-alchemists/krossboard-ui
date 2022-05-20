/*
Copyright (c) 2020 2Alchemists SAS.

This file is part of Krossboard.

Krossboard is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3
of the License, or (at your option) any later version.

Krossboard is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Krossboard.
If not, see <https://www.gnu.org/licenses/>.
*/

import { createContext, useContext } from 'react'

import { KoaStore } from './KoaStore'

interface IStore {
    koaStore: KoaStore
}

export const StoreContext = createContext<IStore>({} as IStore)
export const StoreProvider = StoreContext.Provider

export const useStore = (): KoaStore => useContext(StoreContext).koaStore
