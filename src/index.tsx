import { configure } from 'mobx'
import React, { Suspense } from 'react'
import { render } from 'react-dom'

import { App } from './app/App'
import { koaStore } from './store/KoaStore'

import './i18n/i18n'
import { StoreProvider } from './store/storeProvider'

configure({ enforceActions: "observed" })

const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
)

render(<StoreProvider value={ { koaStore }}>
  <Suspense fallback={<Loader />}>
    <App />
  </Suspense>
</StoreProvider>,
  document.getElementById('root'))
