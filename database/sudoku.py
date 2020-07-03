from database.grid import Grid
from database.puzzle import Puzzle
from database.mask import Mask
from database.mask_cell import MaskCell
import numpy as np

'''Sudoku - a class to prepare database entities of a sudoku puzzle'''


class Sudoku:
    def __init__(self, solved, masked):
        self.data = self.get_solved_entities(solved)
        self.data.extend(self.get_masked_entities(masked))

    def get_solved_entities(self, grid):
        '''get database entities related to a solved grid'''
        data = []
        for row in range(0, 7, 3):
            for col in range(0, 7, 3):
                cels = grid[row:row+3, col:col+3].flatten().tolist()
                data.append(Grid.from_list(cels))
        data.append(Puzzle.from_list(data))
        return data

    def get_masked_entities(self, grid):
        '''get database entities related to a puzzle's mask'''
        data = []
        data.append(Mask(puzzle=self.data[-1]))
        for li in np.transpose(np.where(grid == 0)):
            y, x = tuple(li)
            data.append(MaskCell(mask=data[0], y=int(y), x=int(x)))
        return data
