export interface Puzzle {
  [key: string]: number
}

export interface Mask {
  x: number
  y: number
}

export interface GamesResponse {
  puzzles: Puzzle[]
  masks: { [id: string /* never a string, always puzzle_id number */]: Mask[] }
  difficulty: { [puzzle_id: string]: { difficulty: number } }
}

const indices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']

export const sudokuParser = {
  parse (data: GamesResponse) {
    return data.puzzles
      .sort((a, b) => {
        return data.difficulty[a.puzzle_id].difficulty >
          data.difficulty[b.puzzle_id].difficulty
          ? 1
          : -1
      })
      .map((puzzle: Puzzle) => ({
        ...sudokuParser.compileGameFrom(puzzle, data.masks[puzzle.puzzle_id])
      }))
  },
  compileGameFrom (puzzle: Puzzle, masks: Mask[]) {
    let solution: number[][] = []
    let game: number[][] = []
    indices.forEach(x => solution.push([]))

    indices.forEach((x, i) =>
      indices.forEach((y, j) => {
        const a = Math.floor(i / 3) * 3 + Math.floor(j / 3)
        const b = (i % 3) * 3 + (j % 3)
        solution[a][b] = puzzle[x + y]
      })
    )

    game = JSON.parse(JSON.stringify(solution))

    masks.forEach((mask: Mask) => delete game[mask.y][mask.x])

    return { solution, game, puzzle_id: puzzle.puzzle_id }
  }
}
