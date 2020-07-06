const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const whitelist = require('./whitelist')
globalThis.db = new sqlite3.Database(process.env.DATABASE || '../dev.db')

const endpointsRegistrar = require('./src/endpoints')

const restapi = express()
restapi.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (whitelist.indexOf(origin) === -1) {
        var message =
          "The CORS policy for this origin doesn't allow access from the particular origin."
        return callback(new Error(message), false)
      }
      return callback(null, true)
    }
  })
)

endpointsRegistrar.configure(restapi)

restapi.listen(3000)

console.log('on http://localhost:3000/games')
