from environment import Environment
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

Base = declarative_base()


class DataSource:
    '''data source façade'''

    def __init__(self, connection_string: str):
        '''by default we will connect if we have a connection string'''
        if connection_string == None:
            return

        self.connection_string = connection_string
        self.create_engine()
        self.create_session()

    def create_engine(self):
        '''create the engine we use to talk with the datasouerce'''
        if self.connection_string == None:
            return

        self.engine = create_engine(
            self.connection_string,
            echo=not Environment.is_production()
        )

    def create_session(self):
        '''create the session we will use to communicate with the database'''
        if self.engine == None:
            return

        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def initialize_base(self):
        '''initialize the project classes in the database as needed'''
        if self.engine == None or self.session == None:
            return

        if Environment.is_clear_database():
            self.clear_data()

        Base.metadata.create_all(self.engine)

    def clear_data(self):
        print('[DataSource] CLEARING DATABASE')
        Base.metadata.drop_all(self.engine)

    def commit_transaction(self):
        self.session.commit()
        pass

    def rollback_transaction(self):
        self.session.rollback()
        pass
