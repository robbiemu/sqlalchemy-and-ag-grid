const configurations = [
  {
    path: '/maskcells',
    delegate (req, res) {
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
    }
  },
  {
    path: '/maskcell/:maskcell_id',
    delegate (req, res) {
      const id = req.params.maskcell_id

      const query = 'SELECT * FROM maskcells WHERE maskcells.id == ' + id
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
