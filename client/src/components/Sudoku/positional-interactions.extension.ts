import { CursorMode } from './constants'
import { Highlight } from './highlight.interface'
import { Coordinate } from './coordinate.interface'
import { transpose, getGrid } from './utils'
import { onToggleHighlight } from './hightlight'

function onToggleFocus (coordinate: Coordinate, focus: Coordinate) {
  if (coordinate.x === focus.x && coordinate.y === focus.y) {
    ;(document.activeElement as HTMLElement).blur()
    return {} as Coordinate
  }
  return coordinate
}

export function onCelInput (
  event: InputEvent & any,
  puzzle: number[][],
  i: number,
  j: number,
  controller: any
) {
  const n = Number.parseInt(event.currentTarget.textContent || '0')
  if (n > 0 && n < 10) {
    puzzle[i][j] = n
  }
  if (n === 0) {
    delete puzzle[i][j]
  }
  controller.setTranspose(transpose(puzzle))
  controller.setGrid(getGrid(puzzle))
  controller.setPuzzle(puzzle)
}

export function onCelClick (
  puzzle: number[][],
  i: number,
  j: number,
  highlights: Array<Highlight>,
  cursorMode: CursorMode,
  focus: Coordinate,
  controller: any
) {
  if (cursorMode === CursorMode.default) {
    highlights = highlights.filter(
      highlight => highlight.x === j + 1 && highlight.y === i + 1
    )
    controller.setFocus(onToggleFocus({ x: j, y: i }, focus))
    controller.setHighlights(
      onToggleHighlight(i, j, puzzle[i][j], highlights, focus)
    )
  }
}
