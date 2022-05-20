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

import { configure } from 'mobx'
import React, { Suspense } from 'react'
import { render } from 'react-dom'

import { App } from './app/App'
import { koaStore } from './store/KoaStore'

import './i18n/i18n'
import { StoreProvider } from './store/storeProvider'

configure({ enforceActions: 'observed' })

const Loader = () => (
    <div className="App">
        <div>loading...</div>
    </div>
)

render(
    <StoreProvider value={{ koaStore }}>
        <Suspense fallback={<Loader />}>
            <App />
        </Suspense>
    </StoreProvider>,
    document.getElementById('root')
)
