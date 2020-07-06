# quick demo (sqlAlchemy and ag-grid)

this is a quick demo of working with sql-alchemy and some data visualization with ag-grid.

we will use python to generate some sudoku layouts, which will be loaded into a sqlite database.

we will also generate associated masks to render variations of puzzles in various states of completion.

finally, we will render these in a dashboard with ag-grid. the dashobard will allow the manipulation of the data by different agents that will highlight relationships.

### motivation

to explore ag-grid and sql-alchemy in action. It may seem silly to render data like this. but, it should be easy to folow, and fun.

## instructions

- to run the data server for the client (so you can browse the sudoku generated): `cd server && node index.js`
- to run the client: `cd client && npm run start`
- to run an instance of the data source to generate new sudoku: `python index.py`

### server

there is one environment variable that can effect the runtime:

- DATABASE - when set, the filename (relative path) from the current execution context to the database. specifically, the filename parameter to [sqlite3.Database](https://github.com/mapbox/node-sqlite3/wiki/API#new-sqlite3databasefilename-mode-callback). By default, '../dev.db'.

the server is set up to whitelist localhost:3001, so you should use this port for the client. by default, react will prefer 3000 -- but so will the server. Simply launching the server first will ensure the client will rollover to 3001. alternatively, the whitelist.js file can be altered to clear CORS for the referrer(s) of your choice.

### data-source

For the python generating sudoku, there are some meaningful options to explore:

- CLEARDB - when set to `True`, wipes the database
- PRODUCTION - when set to `True`, runs as if in production
- FREQUENCY - number of seconds between generating sudoku. when not set and not in production, the default frequency is 15 minutes
- CONNECTIONSTRING - when not set and not in production, the default connection string is sqlite://dev.db

Frequency and ConnectionString must be set if Production is set. This can be done manually in the cli execution, for example in UNIX: `CLEARDB=True FREQUENCY=180 python index.py`

## data architecture

this is a dummy data set, so we are just rendering the following tables:

### grid

- id: pkey
- a: number nonnull
- b: number nonnull
- c: number nonnull
- d: number nonnull
- e: number nonnull
- f: number nonnull
- g: number nonnull
- h: number nonnull
- i: number nonnull

an area of the sudoku, with numbers in positions a-i in top-left to bottom-right order.

### puzzle

- - id: pkey
- - grid_a: fkey
- - grid_b: fkey
- - grid_c: fkey
- - grid_d: fkey
- - grid_e: fkey
- - grid_f: fkey
- - grid_g: fkey
- - grid_h: fkey
- - grid_i: fkey

each area of the puzzle in positions a-i in top-left to bottom-right order.

### mask

- id: pkey
- puzzle_id: fkey

a mask grouping associated to a puzzle

### mask-cell

- id: pkey
- mask_id: fkey
- x: number nonnull
- y: number nonnull

components of a mask for a puzzle. each cell indicated in position is not revealed. position indexes the entire puzzle in top-left to bottom-right order.
