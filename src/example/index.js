import React from 'react'
import { render } from 'react-dom'

render(
  <div>
    <iframe src='/example/source.html' />
    <iframe src='/example/target.html' />
  </div>
  , document.getElementById('main')
)
