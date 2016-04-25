require('babel-polyfill')

import React from 'react'
import { render } from 'react-dom'
import { AppRouter } from 'components'

render(AppRouter, document.getElementById('root'))
