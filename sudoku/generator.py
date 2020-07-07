from environment import Environment
import random
import time
import numpy as np

'''classes to generate a solved sudoku'''


class SudokuCel:
    '''convenience generator -- houses options for the cel
        broadcasts when set so that others may be cleared
        clears when instructed'''

    def __init__(self, x, y, delegate):
        self.n = None
        self.seed_numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9}
        self.x = x
        self.y = y
        self.delegate = delegate

    def resolve(self):
        '''become an number at random from seed_numbers'''
        if len(self.seed_numbers) == 0:
            return
        choices = list(self.seed_numbers)
        random.shuffle(choices)
        for choice in choices:
            if not self.delegate.check_backtrack(choice, self.x, self.y):
                self.setN(choice)
                break

    def eliminate(self, m):
        '''remove a number from seed_numbers'''
        self.seed_numbers.discard(m)
        if len(self.seed_numbers) == 1:
            choice = self.seed_numbers.pop()
            if not self.delegate.check_backtrack(choice, self.x, self.y):
                self.setN(choice)

    def setN(self, n):
        '''helper method to set n and broadcast in correct order'''
        self.n = n
        self.seed_numbers.clear()
        self.delegate.broadcast(self.n, self.x, self.y)

    def __repr__(self):
        if self.n == None:
            return str(list(self.seed_numbers))
        return str(self.n)


class SudokuGenerator:
    '''generate a (completed) puzzle with this class'''

    cels = np.empty(shape=(9, 9), dtype=object)
    track = set()
    resolve = False
    retrace = 1
    limit = 0

    def __init__(self, timeout):
        self.limit = timeout

    def generate(self):
        '''a roughly hewn method for generating sudoku by:
        1. initializing an array of cels
        2. for each cel in the array, resolve it
        3. route broadcasts to appropriate cels so they can self-trim and resolve, backtracking as needed
        '''
        for row in range(9):
            for col in range(9):
                self.cels[row, col] = SudokuCel(row, col, self)

        timeout = time.time() + self.limit   # 5 minutes from now
        while True:
            self.retrace = 1
            self.solve()
            if not self.resolve or time.time() > timeout:
                break

    def solve(self):
        self.resolve = False
        self.retrace = self.retrace + 1
        for row in range(9):
            for col in range(9):
                if self.cels[row, col].n is None:
                    if len(self.cels[row, col].seed_numbers) > 0:
                        self.cels[row, col].resolve()
                        if self.cels[row, col].n is None:
                            self.backtrack()
                    else:
                        if not Environment.is_production():
                            print('.', end='', flush=True)
                        if len(self.track) > 0:
                            self.backtrack()

    def backtrack(self):
        for step in range(self.retrace):
            if len(self.track) == 0:
                return
            self.resolve = True

            row, col = self.track.pop()

            self.cels[row, col].n = None
            for r in range(9):
                for i in range(9):
                    for c in range(9):
                        self.cels[r, c].seed_numbers = {
                            1, 2, 3, 4, 5, 6, 7, 8, 9}
                        for j in range(9):
                            if i != r and self.cels[i, c].n != None:
                                self.cels[r, c].seed_numbers.discard(
                                    self.cels[i, c].n)
                            if i != c and self.cels[r, i].n != None:
                                self.cels[r, c].seed_numbers.discard(
                                    self.cels[r, i].n)

            for r in range(9):
                for c in range(9):
                    x = r - r % 3
                    y = c - c % 3
                    for i in range(x, x + 3):
                        for j in range(y, y + 3):
                            if not (i == r and j == c) and self.cels[i, j].n != None:
                                self.cels[r, c].seed_numbers.discard(
                                    self.cels[i, j].n)

    def broadcast(self, n, row, col):
        '''tell each row column and grid member that is not this member that a member has resolved this number, so they can eliminate that number'''
        self.track.add((row, col))
        for i in range(9):
            if i != row:
                self.cels[i, col].eliminate(n)
            if i != col:
                self.cels[row, i].eliminate(n)
        x = row - row % 3
        y = col - col % 3
        for i in range(x, x + 3):
            for j in range(y, y + 3):
                if not (i == row and j == col):
                    self.cels[i, j].eliminate(n)

    def check_backtrack(self, n, row, col):
        '''tell this member if any row column or grid member that is not this member has resolved this number, so they can eliminate that number'''
        for i in range(9):
            if i != row and self.cels[i, col].n == n:
                return True
            if i != col and self.cels[row, i].n == n:
                return True
        x = row - row % 3
        y = col - col % 3
        for i in range(x, x + 3):
            for j in range(y, y + 3):
                if i != row and j != col and self.cels[i, j].n == n:
                    return True
        return False

    def get_grid(self):
        '''return the numpy int grid of our cels'''
        return np.array([x.n for x in self.cels.flatten().tolist()]).reshape((9, 9))
