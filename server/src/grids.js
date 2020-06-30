const configurations = [
  {
    path: '/grids',
    delegate (req, res) {
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
    }
  },
  {
    path: '/grid/:grid_id',
    delegate (req, res) {
      const id = req.params.grid_id

      const query = 'SELECT * FROM grids WHERE grids.id == ' + id
      console.log(query)
      db.get(query, function (err, row) {
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
