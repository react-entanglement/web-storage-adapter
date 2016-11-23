import React from 'react'
import { render } from 'react-dom'
import Entanglement from 'react-entanglement'
import adapter from '../index'
import MagicForm from './components/MagicForm'

const MaterializedMagicForm = Entanglement.materialize({
  name: 'MagicForm',
  constructor: MagicForm
})

render(
  <Entanglement adapter={adapter('web-storage-adapter-demo')}>
    <MaterializedMagicForm />
  </Entanglement>
  , document.getElementById('main')
)
