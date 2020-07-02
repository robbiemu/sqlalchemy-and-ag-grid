import random
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
        self.setN(choices.pop())

    def eliminate(self, m):
        '''remove a number from seed_numbers'''
        self.seed_numbers.discard(m)
        if len(self.seed_numbers) == 1:
            self.setN(self.seed_numbers.pop())

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

    def generate(self):
        '''a roughly hewn method for generating sudoku by:
        1. initializing an array of cels
        2. for each cel in the array, resolve it
        3. route broadcasts to appropriate cels so they can self-trim and resolve
        '''
        for row in range(9):
            for col in range(9):
                self.cels[row, col] = SudokuCel(row, col, self)
        for row in range(9):
            for col in range(9):
                if self.cels[row, col].n is None:
                    self.cels[row, col].resolve()

    def broadcast(self, n, row, col):
        '''tell each row column and grid member that is not this member that a member has resolved this number, so they can eliminate that number'''
        for i in range(9):
            if i != row:
                self.cels[i, col].eliminate(n)
            if i != col:
                self.cels[row, i].eliminate(n)
        x = row - row % 3
        y = col - col % 3
        for i in range(x, x + 3):
            for j in range(y, y + 3):
                if i != row and j != col:
                    self.cels[i, j].eliminate(n)

    def get_grid(self):
        '''return the numpy int grid of our cels'''
        return np.array([x.n for x in self.cels.flatten().tolist()]).reshape((9, 9))
