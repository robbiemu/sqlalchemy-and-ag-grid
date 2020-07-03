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

function getGrid (sudoku: number[][]) {
  const grid = {} as any
  grid['00'] = sudoku[0]
    .slice(0, 3)
    .concat(sudoku[1].slice(0, 3))
    .concat(sudoku[2].slice(0, 3))
  grid['01'] = sudoku[0]
    .slice(3, 6)
    .concat(sudoku[1].slice(3, 6))
    .concat(sudoku[2].slice(3, 6))
  grid['02'] = sudoku[0]
    .slice(6)
    .concat(sudoku[1].slice(6))
    .concat(sudoku[2].slice(6))
  grid['10'] = sudoku[3]
    .slice(0, 3)
    .concat(sudoku[4].slice(0, 3))
    .concat(sudoku[5].slice(0, 3))
  grid['11'] = sudoku[3]
    .slice(3, 6)
    .concat(sudoku[4].slice(3, 6))
    .concat(sudoku[5].slice(3, 6))
  grid['12'] = sudoku[3]
    .slice(6)
    .concat(sudoku[4].slice(6))
    .concat(sudoku[5].slice(6))
  grid['20'] = sudoku[6]
    .slice(0, 3)
    .concat(sudoku[7].slice(0, 3))
    .concat(sudoku[8].slice(0, 3))
  grid['21'] = sudoku[6]
    .slice(3, 6)
    .concat(sudoku[7].slice(3, 6))
    .concat(sudoku[8].slice(3, 6))
  grid['22'] = sudoku[6]
    .slice(6)
    .concat(sudoku[7].slice(6))
    .concat(sudoku[8].slice(6))
  return grid
}

function isSecondaryHighlightRow (
  highlight: Highlight,
  puzzle: number[][],
  i: number
) {
  return puzzle[i].includes(highlight.n || NaN) && i + 1 !== highlight.y
}

function isSecondaryHighlightCol (
  highlight: Highlight,
  sudokuT: number[][],
  i: number,
  j: number
) {
  return sudokuT[j].includes(highlight.n || NaN) && j + 1 !== highlight.x
}

function isHighlightGrid (highlight: Highlight, i: number, j: number) {
  if (highlight.x === undefined || highlight.y === undefined) return false
  if (i + 1 === highlight.y && j + 1 === highlight.x) return false

  const highlightIndex =
    Math.floor((highlight.y - 1) / 3) + '' + Math.floor((highlight.x - 1) / 3)
  const subjectIndex = Math.floor(i / 3) + '' + Math.floor(j / 3)

  console.log('isHighlightGrid', subjectIndex, highlightIndex, i, j, highlight)

  return subjectIndex === highlightIndex
}

function isHighlightCol (highlight: Highlight, j: number) {
  return j + 1 === highlight.x
}

function isHighlightRow (highlight: Highlight, i: number) {
  return i + 1 === highlight.y
}

function isHighlightNumber (
  highlight: Highlight,
  puzzle: number[][],
  i: number,
  j: number
) {
  return puzzle[i][j] && puzzle[i][j] === highlight.n
}

const Sudoku: React.FC<{ sudoku: number[][] }> = ({ sudoku }) => {
  const [highlight, setHighlight] = useState({} as Highlight)
  const [sudokuT, setTranspose] = useState(transpose(sudoku))
  const [puzzle, setPuzzle] = useState(sudoku)
  const [grid, setGrid] = useState(getGrid(sudoku))

  return (
    <div className={styles.Sudoku}>
      {puzzle.map((_, i) => (
        <div
          className={[
            styles.row,
            isSecondaryHighlightRow(highlight, puzzle, i)
              ? styles['secondary-highlight-row']
              : '',
            isHighlightRow(highlight, i) ? styles['highlight-row'] : ''
          ].join(' ')}
          key={i}
        >
          {puzzle.map((_, j) => (
            <div
              className={[
                styles.col,
                'col-' + (j + 1),
                'row-' + (i + 1),
                isSecondaryHighlightCol(highlight, sudokuT, i, j)
                  ? styles['secondary-highlight-col']
                  : '',
                isHighlightGrid(highlight, i, j)
                  ? styles['highlight-grid']
                  : '',
                isHighlightCol(highlight, j) ? styles['highlight-col'] : '',
                isHighlightNumber(highlight, puzzle, i, j)
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
                  setGrid(getGrid(puzzle))
                  setPuzzle(puzzle)
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
