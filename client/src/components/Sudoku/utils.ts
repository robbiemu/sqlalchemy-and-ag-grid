import { Highlight } from './highlight.interface'
import { CursorMode, names } from './constants'
import {
  isSecondaryHighlightRow,
  isHighlightRow,
  isSecondaryHighlightCol,
  isHighlightGrid,
  isHighlightCol,
  isHighlightNumber
} from './hightlight'

export function clearSelection () {
  if (window.getSelection) {
    const selection = window.getSelection()
    if (selection) selection.removeAllRanges()
  }
}

export function focusForTextInput (node: HTMLDivElement) {
  const caret = 0
  const range = document.createRange()
  range.selectNodeContents(node)
  if (!range.toString().length) {
    range.setStart(node, caret)
    range.setEnd(node, caret)
  }

  const sel = window.getSelection()
  if (sel) {
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

export function transpose (sudoku: number[][]) {
  return [...Array(9)].map((_, colIndex) => sudoku.map(row => row[colIndex]))
}

export function getGrid (sudoku: number[][]) {
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

export function isContentEditable (
  i: number,
  j: number,
  cursorMode: CursorMode,
  sudoku: number[][]
) {
  return cursorMode === CursorMode.resolve &&
    (!sudoku[i] || !sudoku[i][j] || sudoku[i][j] < 1 || sudoku[i][j] > 9)
    ? 'true'
    : 'false'
}

export function getRowClass (
  styles: any,
  i: number,
  highlights: Array<Highlight>,
  puzzle: number[][]
) {
  return [
    styles.row,
    isSecondaryHighlightRow(highlights, puzzle, i)
      ? styles['secondary-highlight-row']
      : '',
    isHighlightRow(highlights, i) ? styles['highlight-row'] : ''
  ].join(' ')
}

export function getCelClass (
  styles: any,
  i: number,
  j: number,
  highlights: Array<Highlight>,
  sudokuT: number[][],
  sudoku: number[][],
  puzzle: number[][]
) {
  return [
    styles.col,
    'col-' + (j + 1),
    'row-' + (i + 1),
    sudoku[i][j] ? 'initial-value' : '',
    isSecondaryHighlightCol(highlights, sudokuT, i, j)
      ? styles['secondary-highlight-col']
      : '',
    isHighlightGrid(highlights, i, j) ? styles['highlight-grid'] : '',
    isHighlightCol(highlights, j) ? styles['highlight-col'] : '',
    isHighlightNumber(highlights, puzzle, i, j)
      ? styles['highlight-number']
      : '',
    names[puzzle[i][j]]
  ].join(' ')
}
