import { Coordinate } from './coordinate.interface'
import { Highlight } from './highlight.interface'

export function isSecondaryHighlightRow (
  highlights: Array<Highlight>,
  puzzle: number[][],
  i: number
) {
  return highlights.some(
    highlight => puzzle[i].includes(highlight.n || NaN) && i + 1 !== highlight.y
  )
}

export function isSecondaryHighlightCol (
  highlights: Array<Highlight>,
  sudokuT: number[][],
  i: number,
  j: number
) {
  return highlights.some(
    highlight =>
      sudokuT[j].includes(highlight.n || NaN) && j + 1 !== highlight.x
  )
}

export function isHighlightGrid (
  highlights: Array<Highlight>,
  i: number,
  j: number
) {
  return highlights.some((highlight: Highlight) => {
    if (highlight.x === undefined || highlight.y === undefined) return false
    if (i + 1 === highlight.y && j + 1 === highlight.x) return false

    const highlightIndex =
      Math.floor((highlight.y - 1) / 3) + '' + Math.floor((highlight.x - 1) / 3)
    const subjectIndex = Math.floor(i / 3) + '' + Math.floor(j / 3)

    return subjectIndex === highlightIndex
  })
}

export function isHighlightCol (highlights: Array<Highlight>, j: number) {
  return highlights.some(highlight => j + 1 === highlight.x)
}

export function isHighlightRow (highlights: Array<Highlight>, i: number) {
  return highlights.some(highlight => i + 1 === highlight.y)
}

export function isHighlightNumber (
  highlights: Array<Highlight>,
  puzzle: number[][],
  i: number,
  j: number
) {
  return highlights.some(
    highlight => puzzle[i][j] && puzzle[i][j] === highlight.n
  )
}

export function onToggleHighlight (
  i: number,
  j: number,
  n: number,
  highlights: Array<Highlight>,
  focus: Coordinate
) {
  let index = highlights.findIndex(
    coords => coords.y === i + 1 && coords.x === j + 1
  )
  if (!(focus.x === j && focus.y === i)) {
    if (index !== -1) {
      highlights.splice(index, 1)
    } else if (n > 0 && n < 10) {
      highlights.push({
        y: i + 1,
        x: j + 1,
        n
      })
    }
  }

  return ([] as Highlight[]).concat(highlights)
}
