import React, { useState } from 'react'
import styles from './Sudoku.module.scss'

const names: { [key: string]: string } = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine'
}

interface Highlight {
  x?: number
  y?: number
  n?: number
}

function onToggleHighlight (i: number, j: number, n: number) {
  const highlight: Highlight = {}
  if (n > 0 && n < 10) {
    highlight.y = highlight.y ? undefined : i + 1
    highlight.x = highlight.x ? undefined : j + 1
    highlight.n = highlight.n ? undefined : n
  }
  console.log('onToggleHighlight', i, j, n, highlight)
  return highlight
}

function transpose (sudoku: number[][]) {
  return [...Array(9)].map((_, colIndex) => sudoku.map(row => row[colIndex]))
}

const Sudoku: React.FC<{ sudoku: number[][] }> = ({ sudoku }) => {
  const [highlight, setHighlight] = useState({} as Highlight)
  const [sudokuT, setTranspose] = useState(transpose(sudoku))
  const [puzzle, setPuzzle] = useState(sudoku)

  return (
    <div className={styles.Sudoku}>
      {puzzle.map((_, i) => (
        <div
          className={[
            styles.row,
            puzzle[i].includes(highlight.n || NaN) && i + 1 !== highlight.y
              ? styles['secondary-highlight-row']
              : '',
            i + 1 === highlight.y ? styles['highlight-row'] : ''
          ].join(' ')}
          key={i}
        >
          {puzzle.map((_, j) => (
            <div
              className={[
                styles.col,
                'col-' + (j + 1),
                'row-' + (i + 1),
                sudokuT[j].includes(highlight.n || NaN) && j + 1 !== highlight.x
                  ? styles['secondary-highlight-col']
                  : '',
                j + 1 === highlight.x ? styles['highlight-col'] : '',
                puzzle[i][j] && puzzle[i][j] === highlight.n
                  ? styles['highlight-number']
                  : '',
                names[puzzle[i][j]]
              ].join(' ')}
              tabIndex={0}
              role={'button'}
              aria-label={
                names[puzzle[i][j]]
                  ? 'cel ' + names[puzzle[i][j]]
                  : false || 'empty cel'
              }
              contentEditable='true'
              suppressContentEditableWarning={true}
              onInput={event => {
                const n = Number.parseInt(
                  event.currentTarget.textContent || '0'
                )
                if (n > 0 && n < 10) {
                  puzzle[i][j] = n
                  setTranspose(transpose(puzzle))
                  setPuzzle(puzzle)
                  console.log(puzzle)
                }
              }}
              onMouseEnter={() =>
                setHighlight(onToggleHighlight(i, j, puzzle[i][j]))
              }
              onMouseLeave={() =>
                setHighlight(onToggleHighlight(i, j, puzzle[i][j]))
              }
              onFocus={() =>
                setHighlight(onToggleHighlight(i, j, puzzle[i][j]))
              }
              onBlur={() => setHighlight(onToggleHighlight(i, j, puzzle[i][j]))}
              key={i + ':' + j}
            >
              {puzzle[i][j]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Sudoku
