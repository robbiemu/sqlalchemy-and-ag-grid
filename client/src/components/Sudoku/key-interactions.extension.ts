import { Highlight } from './highlight.interface'
import { Coordinate } from './coordinate.interface'
import { CursorMode } from './constants'

export function onKeyUp (
  ev: KeyboardEvent,
  puzzle: number[][],
  sudoku: number[][],
  focus: Coordinate,
  highlights: Array<Highlight>,
  cursorMode: CursorMode,
  previousCursorMode: CursorMode,
  pencilMarks: number[][][],
  controller: any
) {
  const nextPreviousMode = cursorMode

  switch (ev.key.toLowerCase()) {
    case 'escape':
      console.log('[key-interactions::onKeyUp] on press escape')
      releaseFocusOnKeyPress(
        focus,
        ev.target as HTMLElement,
        highlights,
        controller
      )
      controller.setCursorMode(CursorMode.default)
      break
    case '+':
      controller.setCursorMode(
        cursorMode !== CursorMode.pencilMark
          ? CursorMode.pencilMark
          : previousCursorMode
      )
      break
    case '=':
      controller.setCursorMode(
        cursorMode !== CursorMode.resolve
          ? CursorMode.resolve
          : previousCursorMode
      )
      break
    case 'shift':
      return
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      onNumericInput(
        parseInt(ev.key),
        ev.target as HTMLDivElement,
        puzzle,
        sudoku,
        focus,
        cursorMode,
        pencilMarks,
        controller
      )
      if (cursorMode !== CursorMode.pencilMark) {
        console.log('releasing focus and highlight')
        releaseFocusOnKeyPress(
          getElementLocation(ev.target as HTMLElement) /*alwyas*/,
          ev.target as HTMLElement,
          highlights,
          controller
        )
        controller.setCursorMode(CursorMode.default)
      }
      break
    default:
      if (cursorMode === CursorMode.resolve) {
        releaseFocusOnKeyPress(
          focus,
          ev.target as HTMLElement,
          highlights,
          controller
        )
        controller.setCursorMode(CursorMode.default)
      }
  }

  controller.setPreviousCursorMode(cursorMode)
}

function releaseFocusOnKeyPress (
  focus: Coordinate,
  el: HTMLElement,
  highlights: Array<Highlight>,
  controller: any
) {
  const location: Coordinate = getElementLocation(el)
  ;(document.activeElement as HTMLElement).blur()

  if (location.x == focus.x && location.y == focus.y) {
    console.log('focus and highlight in memory released')
    focus = {} as Coordinate
    controller.setFocus(focus)

    controller.setHighlights([])
  }
}

function onNumericInput (
  value: number,
  target: HTMLDivElement,
  puzzle: number[][],
  sudoku: number[][],
  focus: Coordinate,
  cursorMode: CursorMode,
  pencilMarks: number[][][],
  controller: any
) {
  const location: Coordinate = getElementLocation(target)
  switch (cursorMode) {
    case CursorMode.pencilMark:
      const currentMarks = pencilMarks[location.y][location.x]

      if (currentMarks.includes(value)) {
        currentMarks.splice(currentMarks.indexOf(value), 1)
      } else {
        currentMarks.push(value)
      }
      controller.setPencilMarks(pencilMarks)
      break
    case CursorMode.resolve:
    default:
      pencilMarks[location.y][location.x] = []
      controller.setPencilMarks(pencilMarks)

      controller.setPuzzle(getPuzzleFromInput(puzzle, sudoku, value, target))
  }
}

function getPuzzleFromInput (
  puzzle: number[][],
  sudoku: number[][],
  value: number,
  target: HTMLDivElement
) {
  const location: Coordinate = getElementLocation(target)

  if (sudoku[location.y][location.x] === 0 || !sudoku[location.y][location.x]) {
    puzzle[location.y][location.x] =
      puzzle[location.y][location.x] !== value ? value : (undefined as any)
  }
  return puzzle
}

function getElementLocation (target: HTMLElement): Coordinate {
  const reverseLookupCoordinateLabel: { [key: string]: string } = {
    row: 'y',
    column: 'x'
  }

  return Array.from(target.classList).reduce((prev, curr) => {
    const primitive =
      (curr.match(/^col-(?<column>\d)|row-(?<row>\d)/) ?? {}).groups ?? {}

    const composite = Object.keys(primitive).reduce((p: any, c: string) => {
      if (!primitive[c]) return p
      p[reverseLookupCoordinateLabel[c]] = parseInt(primitive[c]) - 1
      return p
    }, {})

    return Object.assign(prev, composite)
  }, <Coordinate>{})
}
