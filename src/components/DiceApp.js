import React from 'react'
import { Scatter } from 'react-entanglement'
import MagicForm from './MagicForm'

export default function DiceApp ({ value, local, onThrow, onToggle }) {
  const formProps = {
    label: 'Throw dice',
    onSubmit: onThrow
  }

  return (
    <div>
      <button onClick={onToggle}>
        {local ? 'Show form remotely' : 'Show form locally'}
      </button>

      {
        local
          ? <MagicForm {...formProps} />
          : <Scatter name='MagicForm' props={formProps} />
      }

      <p>
        {
          value
            ? `Dice value: ${value}`
            : 'Throw the dice to get a value'
        }
      </p>
    </div>
  )
}
