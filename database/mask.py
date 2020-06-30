from database.data_source import Base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey

'''mask database entity'''


class Mask(Base):
    __tablename__ = 'masks'

    id = Column(Integer, primary_key=True)
    puzzle_id = Column(Integer, ForeignKey('puzzles.id'), nullable=False)
    puzzle = relationship('Puzzle')
