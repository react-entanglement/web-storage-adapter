import React from 'react'
import { render } from 'react-dom'
import adapter from './index'
import Entanglement from 'react-entanglement'
import StateContainer from './components/StateContainer'

render(
  <Entanglement adapter={adapter('web-storage-adapter-demo')}>
    <StateContainer />
  </Entanglement>
  , document.getElementById('main')
)
