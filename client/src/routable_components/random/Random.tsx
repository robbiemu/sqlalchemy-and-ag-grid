import React, { Component, Fragment } from 'react'
import axios from 'axios'
import './Random.css'
import Sudoku from '../../components/Sudoku/Sudoku'
import { sudokuParser } from '../../util/sudoku-parser'

/**
 * schema
 *
 * type: difficult | easy | sparse | full | average
 * sample: n number to search from (leave empty if seaking the most extreme)
 *
 * average + undefined sample => one at random
 * average + n sample => one at random from the n most average
 * ...
 */
function urlFactory (query: URLSearchParams) {
  const type = query.get('type') || 'average'
  const sample = query.get('sample') || 1

  const url = `http://localhost:3000/random?type=${type}`
  return !sample ? url : url + '&sample=' + sample
}

function getUrlForType (type: string) {
  return `http://localhost:3000/random?type=${type}&sample=10`
}

class Random extends Component {
  state = {
    data: { difficulty: {} as { [puzzle_id: string]: number } },
    game: (undefined as unknown) as number[][],
    solution: (undefined as unknown) as number[][],
    puzzle_id: (undefined as unknown) as number,
    type: 'TYPE'
  }

  componentDidMount () {
    const query = new URLSearchParams((this.props as any).location.search)
    const type = query.get('type')

    console.log(query)

    this.getGame(urlFactory(query), type ?? 'random')
  }

  private getGame (url: string, type: string) {
    axios.get(url).then(res => {
      console.log(res.data)

      const { solution, game, puzzle_id } = sudokuParser.parse(res.data)[0]

      this.setState({
        data: res.data,
        solution,
        game,
        puzzle_id,
        type
      })
    })
  }

  render () {
    const getGame = this.getGame.bind(this)
    const types = ['difficult', 'easy', 'sparse', 'full', 'average']

    return (
      <main className='Random'>
        <header>
          <h2>random Sudoku game</h2>
          <span className={'caption'}>
            {this.state.type || 'random'} game (switch to{' '}
            {types.map((type, index) => (
              <Fragment key={'type_' + type}>
                <a
                  className='link'
                  onClick={() => getGame(getUrlForType(type), type)}
                  key={'link_' + type}
                >
                  {type}
                </a>
                {index < types.length - 1 && ' | '}
              </Fragment>
            ))}
            )
          </span>
        </header>
        {this.state.puzzle_id && (
          <section className='puzzle'>
            <span className={'title'}>
              {'puzzle ' + this.state.puzzle_id} (
              {(this.state.data.difficulty[
                this.state.puzzle_id
              ] as any).difficulty.toPrecision(3) + ' difficulty - '}
              {
                (this.state.game as any)
                  .flat()
                  .filter((x: number) => x !== null).length
              }{' '}
              clues)
            </span>
            <Sudoku sudoku={this.state.game as any} />
          </section>
        )}
      </main>
    )
  }
}

export default Random
