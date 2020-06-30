const configurations = [
  {
    path: '/puzzles',
    delegate (req, res) {
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
    }
  },
  {
    path: '/puzzle/:puzzle_id',
    delegate (req, res) {
      const id = req.params.puzzle_id

      const query = 'SELECT * FROM puzzles WHERE puzzles.id == ' + id
      console.log(query)
      globalThis.db.get(query, function (err, row) {
        res.json({ [id]: row })
      })
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
