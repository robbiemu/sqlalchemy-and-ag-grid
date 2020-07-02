import time
import random
import numpy as np
from environment import Environment


class SudokuMasker:
    limit = 0
    seed_numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9}
    '''given a Sudoku grid, reduce it to its least uniquely resolvable shape.'''

    def __init__(self, timeout):
        self.limit = timeout

    def get_minimal_form(self, grid):
        '''get the least uniquely resolvable shape
        1. keep a list of all possible indexes to remove
        2. remove one at random.
        3. try to solve. if it is not solvable, go back to 2. if the list is exhausted, return the current state of the puzzle.
        4. if it is solvable, remove the number from the grid, go back to 1.
        '''
        self.reset_list_of_indices(grid)
        test = grid.copy()
        timeout = time.time() + self.limit
        while(len(self.indices) > 0):
            index = tuple(self.indices.pop())
            n = test[index]
            test[index] = 0
            if not self.is_solvable(test.copy()):
                test[index] = n
            else:
                self.reset_list_of_indices(test)
            if time.time() > timeout:
                break
        return test

    def reset_list_of_indices(self, grid):
        self.indices = np.transpose(np.nonzero(grid)).tolist()
        random.shuffle(self.indices)

    def is_solvable(self, grid):
        '''nice elegant solution from src: https://medium.com/@feliciaSWE/solving-sudoku-with-python-numpy-and-set-95ca55f9ba01'''
        last = np.empty(shape=(9, 9), dtype=object)
        while(not (last == grid).all() and not self.is_solved(grid)):
            last = grid.copy()
            self.reduce(grid)
        return len(np.transpose(np.nonzero(grid))) == 81

    def reduce(self, grid):
        '''src: https://medium.com/@feliciaSWE/solving-sudoku-with-python-numpy-and-set-95ca55f9ba01'''
        P = np.frompyfunc(list, 0, 1)(np.empty((9, 9), dtype=object))
        for row in range(0, 9):
            for col in range(0, 9):
                if grid[row, col] == 0:
                    r = self.seed_numbers - set(grid[row])
                    # Create possible values in column and subtract
                    c = r - set(grid[:, col])
                    # Create possible values in cube and subtract
                    rowStart = (row//3) * 3
                    colStart = (col//3) * 3
                    P[row, col] = list(
                        c - set(grid[rowStart:rowStart+3, colStart:colStart+3].flatten()))
        # Process grid with Possible array values as cells are solved
        for row in range(0, 9):
            for col in range(0, 9):
                # Found correct cell value = Only 1 possible value
                if np.size(P[row, col]) == 1:
                    singleton = P[row, col][0]
                    grid[row, col] = singleton
                    # Remove from Possible list
                    P[row, col].remove(singleton)
                    # Remove from Possible in row
                    for c in range(0, 9):
                        if singleton in P[row, c]:
                            P[row, c].remove(singleton)
                    # Remove from Possible in col
                    for r in range(0, 9):
                        if singleton in P[r, col]:
                            P[r, col].remove(singleton)
                    # Remove from Possible in cube
                    rowStart = row//3*3
                    colStart = col//3*3
                    for i in range(rowStart, rowStart+3):
                        for j in range(colStart, colStart+3):
                            if singleton in P[i, j]:
                                P[i, j].remove(singleton)
        return grid

    def is_solved(self, grid):
        '''src: https://medium.com/@feliciaSWE/solving-sudoku-with-python-numpy-and-set-95ca55f9ba01'''
        is_row_good = True
        for row in range(0, 9):
            is_row_good &= (set(grid[row]) == self.seed_numbers)
        is_col_good = True
        for col in range(0, 9):
            is_col_good &= (set(grid[:, col]) == self.seed_numbers)
        is_cube_good = True
        for cRow in range(0, 9, 3):
            for cCol in range(0, 9, 3):
                is_cube_good &= (set(
                    grid[cRow:cRow+3, cCol:cCol+3].flatten()) == self.seed_numbers)
        return is_row_good and is_col_good and is_cube_good
