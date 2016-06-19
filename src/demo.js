import React from 'react'
import { render } from 'react-dom'

render(
  <div>
    <iframe src='source.html' />
    <iframe src='target.html' />
  </div>
  , document.getElementById('main')
)
