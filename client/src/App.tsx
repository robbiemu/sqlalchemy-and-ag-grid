import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Sudoku from './components/Sudoku/Sudoku'
import { sudokuParser } from './util/sudoku-parser'

class App extends Component {
  state = {
    games: []
  }

  componentDidMount () {
    axios.get('http://localhost:3000/games').then(res => {
      console.log(res.data)
      this.setState({
        games: sudokuParser.parse(res.data)
      })
    })
  }

  render () {
    console.log(this.state.games)
    return (
      <main className='App'>
        <section className='games-listing'>
          <h2>Sudoku games</h2>
          <ul>
            {this.state.games.map(({ solution, game }, index) => (
              <li
                className={'game-listing game-' + index}
                key={'game-' + index}
              >
                <Sudoku sudoku={game as any} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    )
  }
}

export default App
