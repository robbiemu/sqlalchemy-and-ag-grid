
quick demo (sqlAlchemy and ag-grid)
===

this is a quick demo of working with sql-alchemy and some data visualization with ag-grid.

we will use python to generate some sudoku layouts, which will be loaded into a sqlite database.

we will also generate associated masks to render variations of puzzles in various states of completion.

finally, we will render these in a dashboard with ag-grid. the dashobard will allow the manipulation of the data by different agents that will highlight relationships.

### motivation

to explore ag-grid and sql-alchemy in action. It may seem silly to render data like this. but, it should be easy to folow, and fun.

## data architecture

this is a dummy data set, so we are just rendering the following tables:

### grid
id: pkey
a: number nonnull
b: number nonnull
c: number nonnull
d: number nonnull
e: number nonnull
f: number nonnull
g: number nonnull
h: number nonnull
i: number nonnull

an area of the sudoku, with numbers in positions a-i in top-left to bottom-right order.

### puzzle
id: pkey
grid_a: fkey
grid_b: fkey
grid_c: fkey
grid_d: fkey
grid_e: fkey
grid_f: fkey
grid_g: fkey
grid_h: fkey
grid_i: fkey

each area of the puzzle in positions a-i in top-left to bottom-right order.

### mask

id: pkey
puzzle_id: fkey

a mask grouping associated to a puzzle

### mask-cell
id: pkey
mask_id: fkey
x: number nonnull
y: number nonnull

components of a mask for a puzzle. each cell indicated in position is not revealed. position indexes the entire puzzle in top-left to bottom-right order.
