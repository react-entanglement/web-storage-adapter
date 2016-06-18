import React, { Component } from 'react'
import DiceApp from './DiceApp'

class StateContainer extends Component {
  constructor () {
    super()

    this.state = {
      value: undefined,
      local: false
    }
  }

  handleDiceThrow (diceType) {
    this.setState({
      ...this.state,
      value: Math.floor(Math.random() * diceType) + 1
    })
  }

  handleToggle () {
    this.setState({
      ...this.state,
      local: !this.state.local
    })
  }

  render () {
    return (
      <DiceApp
        value={this.state.value}
        local={this.state.local}
        onThrow={this.handleDiceThrow.bind(this)}
        onToggle={this.handleToggle.bind(this)}
      />
    )
  }
}

export default StateContainer
