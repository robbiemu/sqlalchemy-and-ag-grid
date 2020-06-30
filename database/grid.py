from database.data_source import Base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Column, Integer


class Grid(Base):
    __tablename__ = 'grids'

    @staticmethod
    def from_list(cels):
        entity = Grid()
        entity.a = cels[0]
        entity.b = cels[1]
        entity.c = cels[2]
        entity.d = cels[3]
        entity.e = cels[4]
        entity.f = cels[5]
        entity.g = cels[6]
        entity.h = cels[7]
        entity.i = cels[8]
        return entity

    id = Column(Integer, primary_key=True)
    a = Column(Integer, nullable=False)
    b = Column(Integer, nullable=False)
    c = Column(Integer, nullable=False)
    d = Column(Integer, nullable=False)
    e = Column(Integer, nullable=False)
    f = Column(Integer, nullable=False)
    g = Column(Integer, nullable=False)
    h = Column(Integer, nullable=False)
    i = Column(Integer, nullable=False)
