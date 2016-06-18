import React from 'react'
import { render } from 'react-dom'
import adapter from './adapter'
import Entanglement from 'react-entanglement'
import StateContainer from './components/StateContainer'

render(
  <Entanglement adapter={adapter}>
    <StateContainer />
  </Entanglement>
  , document.getElementById('main')
)