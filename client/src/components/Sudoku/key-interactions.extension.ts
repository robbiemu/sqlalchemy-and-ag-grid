import { Highlight } from './highlight.interface'
import { Coordinate } from './coordinate.interface'
import { CursorMode } from './constants'
import { updatePuzzle } from './positional-interactions.extension'
import { isInVisibleConflict } from './hightlight'
import { transpose } from './utils'

export function onKeyUp (
  ev: KeyboardEvent,
  puzzle: number[][],
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
    case 'delete':
    case 'backspace':
    case 'space':
    case '0':
      onNumericInput(
        0,
        ev.target as HTMLDivElement,
        puzzle,
        cursorMode,
        pencilMarks,
        controller
      )
    case 'up arrow':
    case 'left arrow':
    case 'down arrow':
    case 'right arrow':
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
        cursorMode,
        pencilMarks,
        controller
      )
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
    focus = {} as Coordinate
    controller.setFocus(focus)

    highlights.filter(
      highlight => !(highlight.x === location.x && highlight.y === location.y)
    )

    controller.setHighlights(highlights)
    console.log('focus and highlight in memory released', highlights)
  }
}

function onNumericInput (
  value: number,
  target: HTMLDivElement,
  puzzle: number[][],
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
      const isInsertion =
        puzzle[location.y][location.x] !== value && value !== 0
      if (isInsertion) {
        puzzle[location.y][location.x] = value
      } else {
        delete puzzle[location.y][location.x]
      }
      updatePuzzle(puzzle, controller)

      if (
        isInsertion &&
        !isInVisibleConflict(puzzle, transpose(puzzle), location.y, location.x)
      ) {
        updatePencilMarks(location, pencilMarks, value, controller)
      }
  }

  if (cursorMode === CursorMode.pencilMark) {
    controller.setFocus(location)
  }
}

function updatePencilMarks (
  location: Coordinate,
  pencilMarks: number[][][],
  value: number,
  controller: any
) {
  pencilMarks[location.y].forEach(cel => {
    if (cel.includes(value)) {
      cel.splice(cel.indexOf(value), 1)
    }
  })
  pencilMarks.forEach(row => {
    const cel = row[location.x]
    if (cel.includes(value)) {
      cel.splice(cel.indexOf(value), 1)
    }
  })

  const gi = Math.floor(location.y / 3) * 3
  const gj = Math.floor(location.x / 3) * 3
  pencilMarks
    .filter((r, ind) => ind >= gi && ind <= gi + 2)
    .forEach((r: number[][], ind) =>
      r
        .filter(
          (c, inde) =>
            inde >= gj &&
            inde <= gj + 2 &&
            !(ind === location.y - gi && inde === location.x)
        )
        .forEach(cel => {
          if (cel.includes(value)) {
            cel.splice(cel.indexOf(value), 1)
          }
        })
    )
  // pencilMarks[location.y][location.x] = []
  controller.setPencilMarks(pencilMarks)
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
