import React, { Component } from 'react'
import Routes from './routes/routes'
import {HashRouter} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Routes/>
      </HashRouter>
    )
  }
}

export default App