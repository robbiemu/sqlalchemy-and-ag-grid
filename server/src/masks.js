const configurations = [
  {
    path: '/masks',
    delegate (req, res) {
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
    }
  },
  {
    path: '/mask/:mask_id',
    delegate (req, res) {
      const id = req.params.mask_id

      const query = 'SELECT * FROM masks WHERE masks.id == ' + id
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
