const express = require('express')
const sqlite3 = require('sqlite3').verbose()
globalThis.db = new sqlite3.Database('../dev.db')

const endpointsRegistrar = require('./src/endpoints')

const restapi = express()

endpointsRegistrar.configure(restapi)

restapi.listen(3000)

console.log('on http://localhost:3000/games')
