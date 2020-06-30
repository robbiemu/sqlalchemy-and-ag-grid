from environment import Environment
from sudoku.generator import SudokuGenerator
from sudoku.masker import SudokuMasker
from database.data_source import DataSource
from database.sudoku import Sudoku
import threading


class DataService:
    def __init__(self):
        self.initialize_database()

    def initialize_database(self):
        connection_string = Environment.get_connection_string()
        self.data_source = DataSource(connection_string)
        self.data_source.initialize_base()

    def task(self):
        data = self.get_data()

        self.data_source.session.add_all(data)
        self.data_source.commit_transaction()

    def get_data(self):
        grid = self.generate_board()
        if not Environment.is_production():
            print(grid, flush=True)
        masked = self.generate_puzzle(grid)
        if not Environment.is_production():
            print(masked, flush=True)

        s = Sudoku(grid, masked)
        return s.data

    def generate_puzzle(self, seed):
        masker = SudokuMasker()
        grid = masker.get_minimal_form(seed)

        return grid

    def generate_board(self):
        generator = SudokuGenerator()
        generator.generate()
        return generator.get_grid()


def iterate():
    ds.task()
    threading.Timer(freq, iterate).start()


ds = DataService()
freq = Environment.get_frequency()
iterate()
