import { configure } from 'mobx'
import * as React from 'react'
import { render } from 'react-dom'

import { App } from './app/App'
import { koaStore } from './store/KoaStore'
import { StoreProvider } from './store/storeProvider'

configure({ enforceActions: "observed" })

render(<StoreProvider value={koaStore}>
  <App />
</StoreProvider>,
  document.getElementById('root'))
