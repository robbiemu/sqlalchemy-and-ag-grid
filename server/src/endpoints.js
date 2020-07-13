const grids = require('./grids')
const games = require('./games')
const maskcells = require('./maskcells')
const masks = require('./masks')
const puzzles = require('./puzzles')
const random = require('./random')

class EndpointRegistrar {
  constructor () {
    this.registrants = {}
  }

  register (path, delegateFunc) {
    this.registrants[path] = delegateFunc
  }

  configure (api) {
    Object.entries(this.registrants).forEach(([endpoint, df]) => {
      api.get(endpoint, df)
    })
  }

  visit (endpoint) {
    endpoint.accept(this)
  }
}

endpointRegistrar = new EndpointRegistrar()
;[grids, games, maskcells, masks, puzzles, random].forEach(endpoint =>
  endpointRegistrar.visit(endpoint)
)
module.exports = endpointRegistrar
