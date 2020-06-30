const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('dev.db')

const express = require('express')
const restapi = express()

restapi.get('/puzzles', function (req, res) {
  const results = []

  const query = 'SELECT * FROM puzzles'
  console.log(query)
  db.each(
    query,
    function (err, row) {
      results.push(row)
    },
    () => res.json(results)
  )
})

restapi.get('/puzzle/:puzzle_id', function (req, res) {
  const id = req.params.puzzle_id

  const query = 'SELECT * FROM puzzles WHERE puzzles.id == ' + id
  console.log(query)
  db.get(query, function (err, row) {
    res.json({ [id]: row })
  })
})

restapi.get('/grids', function (req, res) {
  const results = []

  const query = 'SELECT * FROM grids'
  console.log(query)
  db.each(
    query,
    function (err, row) {
      results.push(row)
    },
    () => res.json(results)
  )
})

restapi.get('/grid/:grid_id', function (req, res) {
  const id = req.params.grid_id

  const query = 'SELECT * FROM grids WHERE grids.id == ' + id
  console.log(query)
  db.get(query, function (err, row) {
    res.json({ [id]: row })
  })
})

restapi.get('/masks', function (req, res) {
  const results = []

  const query = 'SELECT * FROM masks'
  console.log(query)
  db.each(
    query,
    function (err, row) {
      results.push(row)
    },
    () => res.json(results)
  )
})

restapi.get('/mask/:mask_id', function (req, res) {
  const id = req.params.mask_id

  const query = 'SELECT * FROM masks WHERE masks.id == ' + id
  console.log(query)
  db.get(query, function (err, row) {
    res.json({ [id]: row })
  })
})

restapi.get('/maskcells', function (req, res) {
  const results = []

  const query = 'SELECT * FROM maskcells'
  console.log(query)
  db.each(
    query,
    function (err, row) {
      results.push(row)
    },
    () => res.json(results)
  )
})

restapi.get('/maskcell/:maskcell_id', function (req, res) {
  const id = req.params.maskcell_id

  const query = 'SELECT * FROM maskcells WHERE maskcells.id == ' + id
  console.log(query)
  db.get(query, function (err, row) {
    res.json({ [id]: row })
  })
})

restapi.get('/games', function (req, res) {
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
})

restapi.get('/game/:puzzle_id/:mask_id', function (req, res) {
  const puzzle_id = req.params.puzzle_id
  const mask_id = req.params.mask_id

  const maskcells = []
  const results = new Proxy(
    {},
    {
      set (target, property, value) {
        target[property] = value
        if (target.hasOwnProperty('puzzle') && target.hasOwnProperty('mask'))
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
})

restapi.post('/data-post', function (req, res) {
  db.run(
    'UPDATE counts SET value = value + 1 WHERE key = ?',
    'counter',
    function (err, row) {
      if (err) {
        console.err(err)
        res.status(500)
      } else {
        res.status(202)
      }
      res.end()
    }
  )
})

restapi.listen(3000)

console.log('on http://localhost:3000/puzzles')
