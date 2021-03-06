from environment import Environment
from sudoku.generator import SudokuGenerator
from sudoku.masker import SudokuMasker
from database.data_source import DataSource
from database.sudoku import Sudoku
import time

'''Data Service - a class to generate and send puzzles to the database'''


class DataService:
    def __init__(self):
        self.initialize_database()

    def initialize_database(self):
        '''set up database session'''
        connection_string = Environment.get_connection_string()
        self.data_source = DataSource(connection_string)
        self.data_source.initialize_base()

    def task(self):
        '''get sudoku data for upload and send it to the database'''
        data = self.get_data()

        if data is None:
            return

        self.data_source.session.add_all(data)
        self.data_source.commit_transaction()

    def get_data(self):
        '''get sudoku data for upload'''
        limit = Environment.get_frequency() - 1
        timeout = time.time() + limit

        grid = self.generate_board(limit)
        if None in grid:
            print('failed to generate grid in timelimit', limit, grid)
            return
        if not Environment.is_production():
            print('\n', grid, flush=True)

        limit = timeout - time.time()
        masked = self.generate_puzzle(grid, limit)
        if masked is None or None in masked or not 0 in masked:
            print('failed to generate grid and masks in timelimit', limit, masked)
            return
        if not Environment.is_production():
            print('\n', masked, flush=True)

        s = Sudoku(grid, masked)
        return s.data

    def generate_puzzle(self, seed, timeout):
        '''get a set of masks to generate a playable game from the sudoku solution'''
        masker = SudokuMasker(timeout)
        grid = masker.get_minimal_form(seed)

        return grid

    def generate_board(self, timeout):
        '''get a solved sudoku'''
        generator = SudokuGenerator(timeout)
        generator.generate()
        return generator.get_grid()
