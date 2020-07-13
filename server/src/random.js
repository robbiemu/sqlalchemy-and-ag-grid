function proxySetUniquePuzzle (target, property, value, receiver) {
  target[property] = value
  if (
    target.hasOwnProperty('onCompletePuzzles') &&
    target.hasOwnProperty('onCompleteMasks')
  ) {
    target.res.json({
      puzzles: target.puzzles,
      masks: target.masks,
      difficulty: target.difficulty
    })
  } else if (target.hasOwnProperty('onCompletePuzzles')) {
    maskQuery(target.puzzles[0].puzzle_id, receiver)
  }
}

function buildIndicesJoins () {
  return indices
    .map(
      x =>
        `INNER JOIN grids AS grid_${x} ON puzzle.grid_${x}_id == grid_${x}.id`
    )
    .join(' ')
}

const indices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
const selection_columns = buildSelectionColumns(indices)
function buildSelectionColumns (indices) {
  return indices
    .map(x => indices.map(y => `grid_${x}.${y} as ${x}${y}`))
    .flat()
    .join(', ')
}

function maskQuery (puzzle_id, results) {
  const mask_query = `
SELECT puzzles.id as puzzle_id, masks.difficulty, maskcells.x, maskcells.y 
  FROM maskcells 
  INNER JOIN masks ON maskcells.mask_id == masks.id 
  INNER JOIN puzzles ON masks.puzzle_id == puzzles.id
  WHERE puzzles.id == ${puzzle_id}`
  console.log(mask_query)
  db.each(
    mask_query,
    function (err, row) {
      if (!results.masks.hasOwnProperty(row.puzzle_id))
        results.masks[row.puzzle_id] = []
      results.masks[row.puzzle_id].push({ x: row.x, y: row.y })
      results.difficulty[row.puzzle_id] = row
    },
    function () {
      results.onCompleteMasks = true
    }
  )
}

const configurations = [
  {
    path: '/random',
    delegate (req, res) {
      const type = req.query.type
      const sample = req.query.sample

      const results = new Proxy(
        { puzzles: [], masks: {}, difficulty: {}, res },
        { set: proxySetUniquePuzzle }
      )

      const joins = buildIndicesJoins()

      let puzzle_query

      switch (type) {
        case 'difficult':
          puzzle_query = `
SELECT DISTINCT puzzle.id as puzzle_id, ${selection_columns} 
  FROM puzzles AS puzzle ${joins}
    WHERE puzzle.id IN (
    SELECT id FROM (
      SELECT puzzles_b.id FROM puzzles AS puzzles_b
        JOIN masks ON masks.puzzle_id = puzzles_b.id
        ORDER BY masks.difficulty DESC
        LIMIT ${sample}
    )
      ORDER BY RANDOM()
      LIMIT 1
  )`
          break
        case 'easy':
          puzzle_query = `
SELECT DISTINCT puzzle.id as puzzle_id, ${selection_columns} 
  FROM puzzles AS puzzle ${joins}
    WHERE puzzle.id IN (
    SELECT id FROM (
      SELECT puzzles_b.id FROM puzzles AS puzzles_b
        JOIN masks ON masks.puzzle_id = puzzles_b.id
        ORDER BY masks.difficulty ASC
        LIMIT ${sample}
    )
      ORDER BY RANDOM()
      LIMIT 1
  )`
          break
        case 'sparse':
          puzzle_query = `
SELECT DISTINCT puzzle.id as puzzle_id, ${selection_columns} 
  FROM puzzles AS puzzle ${joins}
    WHERE puzzle.id IN (
    SELECT id FROM (
      SELECT puzzles_b.id 
        FROM puzzles AS puzzles_b
          INNER JOIN masks AS mask ON mask.puzzle_id == puzzles_b.id
          INNER JOIN maskcells AS maskcell ON maskcell.mask_id == mask.id
        GROUP BY mask.id
        ORDER BY COUNT(*) DESC
        LIMIT ${sample}
    )
      ORDER BY RANDOM()
      LIMIT 1
  )`
          break
        case 'full':
          puzzle_query = `
SELECT DISTINCT puzzle.id as puzzle_id, ${selection_columns} 
  FROM puzzles AS puzzle ${joins}
    WHERE puzzle.id IN (
    SELECT id FROM (
      SELECT puzzles_b.id 
        FROM puzzles AS puzzles_b
          INNER JOIN masks AS mask ON mask.puzzle_id == puzzles_b.id
          INNER JOIN maskcells AS maskcell ON maskcell.mask_id == mask.id
        GROUP BY mask.id
        ORDER BY COUNT(*) ASC
        LIMIT ${sample}
    )
      ORDER BY RANDOM()
      LIMIT 1
  )`
          break
        case 'average':
          puzzle_query = `
SELECT DISTINCT puzzle.id as puzzle_id, ${selection_columns} 
  FROM puzzles AS puzzle ${joins}
  WHERE puzzle.id IN (
    SELECT id FROM puzzles
      ORDER BY RANDOM()
      LIMIT ${sample}
  )
  LIMIT 1
`
          break
        default:
          console.warn('unrecongized required parameter type:', type)
      }

      console.log(puzzle_query)
      db.each(
        puzzle_query,
        function (err, row) {
          results.puzzles.push(row)
        },
        () => (results.onCompletePuzzles = true)
      )
    }
  }
]

module.exports = {
  accept (registrar) {
    configurations.forEach(configuration => {
      registrar.register(configuration.path, configuration.delegate)
    })
  }
}
