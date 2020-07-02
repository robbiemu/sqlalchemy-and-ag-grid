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
      indices.forEach((y, j) => {
        const a = Math.floor(i / 3) * 3 + Math.floor(j / 3)
        const b = (i % 3) * 3 + (j % 3)
        game[a][b] = puzzle[x + y]
      })
    )
    console.log('game', JSON.parse(JSON.stringify(game)))

    masks.forEach((mask: Mask) => delete game[mask.y][mask.x])

    return game
  }
}
