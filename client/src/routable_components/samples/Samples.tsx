import React, { Component } from 'react'
import axios from 'axios'
import './Samples.css'
import Sudoku from '../../components/Sudoku/Sudoku'
import { sudokuParser } from '../../util/sudoku-parser'

class Samples extends Component {
  state = {
    data: { difficulty: {} },
    games: []
  }

  componentDidMount () {
    axios.get('http://localhost:3000/games?sample=4').then(res => {
      console.log(res.data)
      this.setState({
        data: res.data,
        games: sudokuParser.parse(res.data)
      })
    })
  }

  render () {
    return (
      <main className='Samples'>
        <section className='games-listing'>
          <header>
            <h2>Sudoku games</h2>
            <span className={'caption'}>
              sample {this.state.games.length} games
            </span>
          </header>
          <ul>
            {this.state.games.map(({ solution, game, puzzle_id }, index) => (
              <li
                className={'game-listing game-' + index}
                key={'game-' + index}
              >
                <span className={'title'}>
                  {'puzzle ' + puzzle_id} (
                  {(this.state.data.difficulty[
                    puzzle_id
                  ] as any).difficulty.toPrecision(3) + ' difficulty - '}
                  {
                    (game as any).flat().filter((x: number) => x !== null)
                      .length
                  }{' '}
                  clues)
                </span>
                <Sudoku sudoku={game as any} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    )
  }
}

export default Samples
