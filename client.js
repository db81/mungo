require('babel-polyfill')

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { AppRoutes } from 'components'
import reducers from 'reducers'

let store = createStore(reducers, document.__initialState, applyMiddleware(thunk))

render(<Provider store={store}>{AppRoutes}</Provider>, document.getElementById('root'))
