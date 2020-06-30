const configurations = [
  {
    path: '/games',
    delegate (req, res) {
      const results = new Proxy(
        { puzzles: [], masks: {} },
        {
          set (target, property, value) {
            target[property] = value
            if (
              target.hasOwnProperty('onCompletePuzzles') &&
              target.hasOwnProperty('onCompleteMasks')
            )
              res.json({ puzzles: target.puzzles, masks: target.masks })
          }
        }
      )

      const indices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
      const selection_columns = indices
        .map(x => indices.map(y => `grid_${x}.${y} as ${x}${y}`))
        .flat()
        .join(', ')
      const joins = indices
        .map(
          x =>
            `INNER JOIN grids AS grid_${x} ON puzzle.grid_${x}_id == grid_${x}.id`
        )
        .join(' ')

      const puzzle_query = `SELECT puzzle.id, ${selection_columns} FROM puzzles AS puzzle ${joins}`
      console.log(puzzle_query)
      db.each(
        puzzle_query,
        function (err, row) {
          results.puzzles.push(row)
        },
        () => (results.onCompletePuzzles = true)
      )

      const mask_query =
        'SELECT puzzles.id as puzzle_id, maskcells.x, maskcells.y FROM maskcells ' +
        'INNER JOIN masks ON maskcells.mask_id == masks.id ' +
        'INNER JOIN puzzles ON masks.puzzle_id == puzzles.id'
      console.log(mask_query)
      db.each(
        mask_query,
        function (err, row) {
          if (!results.masks.hasOwnProperty(row.puzzle_id))
            results.masks[row.puzzle_id] = []
          results.masks[row.puzzle_id].push({ x: row.x, y: row.y })
        },
        function () {
          results.onCompleteMasks = true
        }
      )
    }
  },
  {
    path: '/game/:puzzle_id/:mask_id',
    delegate (req, res) {
      const puzzle_id = req.params.puzzle_id
      const mask_id = req.params.mask_id

      const maskcells = []
      const results = new Proxy(
        {},
        {
          set (target, property, value) {
            target[property] = value
            if (
              target.hasOwnProperty('puzzle') &&
              target.hasOwnProperty('mask')
            )
              res.json(target)
          }
        }
      )

      if (isNaN(puzzle_id) || isNaN(mask_id)) {
        res.status(400)
      }

      const indices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
      const selection_columns = indices
        .map(x => indices.map(y => `grid_${x}.${y} as ${x}${y}`))
        .flat()
        .join(', ')
      const joins = indices
        .map(
          x =>
            `INNER JOIN grids AS grid_${x} ON puzzle.grid_${x}_id == grid_${x}.id`
        )
        .join(' ')

      const puzzle_query = `SELECT ${selection_columns} FROM puzzles AS puzzle ${joins} WHERE puzzle.id == ${puzzle_id}`
      console.log(puzzle_query)
      db.get(puzzle_query, function (err, row) {
        results.puzzle = row
      })

      const mask_query =
        'SELECT maskcells.x, maskcells.y FROM maskcells WHERE maskcells.mask_id == ' +
        mask_id
      console.log(mask_query)
      db.each(
        mask_query,
        function (err, row) {
          maskcells.push(row)
        },
        function () {
          results.mask = maskcells
        }
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
