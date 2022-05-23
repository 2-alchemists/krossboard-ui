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
