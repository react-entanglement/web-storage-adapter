import React, { Component } from 'react'

const handleSubmit = (onSubmit, component) => (e) => {
  e.preventDefault()

  onSubmit(parseInt(component.state.diceType, 10))
}

const handleChange = (component) => (e) => {
  component.setState({
    diceType: e.target.value
  })
}

class MagicForm extends Component {
  constructor () {
    super()

    this.state = {
      diceType: '6'
    }
  }

  render () {
    const { label, onSubmit } = this.props
    const { diceType } = this.state

    return (
      <form onSubmit={handleSubmit(onSubmit, this)}>
        <button>{label}</button>
        <p>
          Dice type:
          <input onChange={handleChange(this)} value={diceType} />
        </p>
      </form>
    )
  }
}

export default MagicForm
