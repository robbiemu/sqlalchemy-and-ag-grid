import os
import time

DEFAULT_FREQUENCY = 60*15   # 15 minutes
DEFAULT_CONNECTIONSTRING = 'sqlite:///dev.db'


class Environment:
    '''return runtime settings'''

    @staticmethod
    def is_production():
        '''true when runtime is in production'''
        production = os.getenv('PRODUCTION')

        return production == 'True'

    @staticmethod
    def get_frequency():
        freq = os.getenv('FREQUENCY')
        if freq == None:
            if Environment.is_production():
                raise Exception('no FREQUENCY env set in production!')
            return DEFAULT_FREQUENCY
        return int(freq)

    @staticmethod
    def get_connection_string():
        connection_string = os.getenv('CONNECTIONSTRING')
        if connection_string == None:
            if Environment.is_production():
                raise Exception('no CONNECTIONSTRING env set in production!')
            return DEFAULT_CONNECTIONSTRING
        return connection_string

    @staticmethod
    def is_clear_database():
        clear_database = os.getenv('CLEARDB')

        return clear_database == 'True'
