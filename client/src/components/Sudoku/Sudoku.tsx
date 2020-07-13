import React, { useState, useEffect, useRef } from 'react'
import { Md5 } from 'md5-typescript'
import styles from './Sudoku.module.scss'
import { onToggleHighlight } from './hightlight'
import { onCelInput, onCelClick } from './positional-interactions.extension'
import { onKeyUp } from './key-interactions.extension'
import { Coordinate } from './coordinate.interface'
import { Highlight } from './highlight.interface'
import {
  transpose,
  getGrid,
  getRowClass,
  getCelClass,
  isContentEditable,
  focusForTextInput
} from './utils'
import { CursorMode, names } from './constants'

const Sudoku: React.FC<{ sudoku: number[][] }> = ({ sudoku }) => {
  const [cursorMode, setCursorMode] = useState(CursorMode.default)
  const [previousCursorMode, setPreviousCursorMode] = useState(
    CursorMode.default
  )
  const [focus, setFocus] = useState({} as Coordinate)
  const [highlights, setHighlights] = useState([] as Array<Highlight>)
  const [puzzle, setPuzzle] = useState(JSON.parse(JSON.stringify(sudoku)))
  const [sudokuT, setTranspose] = useState(transpose(puzzle))
  const [grid, setGrid] = useState(getGrid(sudoku))
  const [pencilMarks, setPencilMarks] = useState(
    [...Array(sudoku.length)].map(row =>
      [...Array(sudoku[0].length)].map(row => [...Array(sudoku[0].length)])
    )
  )

  let previousBoard = useRef()
  useEffect(() => {
    const signature = Md5.init(JSON.stringify(sudoku))
    if (previousBoard.current !== signature) {
      setCursorMode(CursorMode.default)
      setFocus({} as Coordinate)
      setHighlights([] as Array<Highlight>)
      setTranspose(transpose(sudoku))
      setPuzzle(JSON.parse(JSON.stringify(sudoku)))
      setGrid(getGrid(sudoku))
      setPencilMarks(
        [...Array(sudoku.length)].map(row =>
          [...Array(sudoku[0].length)].map(row => [...Array(sudoku[0].length)])
        )
      )
    }
    previousBoard.current = signature as any
  })

  const controller = {
    setTranspose,
    setGrid,
    setPuzzle,
    setCursorMode,
    setPreviousCursorMode,
    setPencilMarks,
    setFocus,
    setHighlights
  }

  return (
    <div
      className={[styles.Sudoku, cursorMode].join(' ')}
      onKeyUp={(ev: any) =>
        onKeyUp(
          ev,
          puzzle,
          focus,
          highlights,
          cursorMode,
          previousCursorMode,
          pencilMarks,
          controller
        )
      }
    >
      {cursorMode}
      {puzzle.map((_: any, i: number) => (
        <div className={getRowClass(styles, i, highlights, puzzle)} key={i}>
          {puzzle.map((_: any, j: number) => (
            <div
              className={getCelClass(
                styles,
                i,
                j,
                highlights,
                sudokuT,
                sudoku,
                puzzle
              )}
              tabIndex={0}
              role={'button'}
              aria-disabled={!isContentEditable(i, j, cursorMode, sudoku)}
              aria-label={
                names[puzzle[i][j]]
                  ? 'cel ' + names[puzzle[i][j]]
                  : false || 'empty cel'
              }
              contentEditable={isContentEditable(i, j, cursorMode, sudoku)}
              suppressContentEditableWarning={true}
              onInput={ev => onCelInput(ev, puzzle, i, j, controller)}
              onClick={() =>
                onCelClick(
                  puzzle,
                  i,
                  j,
                  highlights,
                  cursorMode,
                  focus,
                  controller
                )
              }
              onDoubleClick={ev => {
                ev.persist()
                setPreviousCursorMode(
                  cursorMode !== CursorMode.resolve
                    ? cursorMode
                    : CursorMode.default
                )
                setCursorMode(CursorMode.resolve)
                setTimeout(
                  () => focusForTextInput(ev.target as HTMLDivElement),
                  20
                )
              }}
              onMouseEnter={() => {
                setHighlights(
                  onToggleHighlight(i, j, puzzle[i][j], highlights, focus)
                )
              }}
              onMouseLeave={() => {
                setHighlights(
                  onToggleHighlight(i, j, puzzle[i][j], highlights, focus)
                )
              }}
              onFocus={() => {
                setHighlights(
                  onToggleHighlight(i, j, puzzle[i][j], highlights, focus)
                )
              }}
              onBlur={() => {
                setHighlights(
                  onToggleHighlight(i, j, puzzle[i][j], highlights, focus)
                )
              }}
              key={i + ':' + j}
            >
              {puzzle[i][j]}
              <div className={styles['pencil-marks']}>
                {pencilMarks[i][j].join(' ')}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Sudoku
