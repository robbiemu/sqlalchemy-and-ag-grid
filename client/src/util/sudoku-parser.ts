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
}

const indices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']

export const sudokuParser = {
  parse (data: GamesResponse) {
    return data.puzzles.map((puzzle: Puzzle) =>
      sudokuParser.getPlayableGameFrom(puzzle, data.masks[puzzle.puzzle_id])
    )
  },
  getPlayableGameFrom (puzzle: Puzzle, masks: Mask[]) {
    let game: number[][] = []
    indices.forEach(x => game.push([]))

    indices.forEach((x, i) =>
      indices.forEach((y, j) => (game[i][j] = puzzle[x + y]))
    )

    masks.forEach((mask: Mask) => delete game[mask.x][mask.y])

    return game
  }
}
