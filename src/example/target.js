import React from 'react'
import { render } from 'react-dom'
import { Materialize } from 'react-entanglement'
import adapter from '../index'
import MagicForm from './components/MagicForm'

render(
  <Materialize
    name='MagicForm'
    component={MagicForm}
    adapter={adapter('web-storage-adapter-demo')}
  />
  , document.getElementById('main')
)