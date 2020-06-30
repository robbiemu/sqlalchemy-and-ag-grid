from database.data_source import Base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey


class Puzzle(Base):
    __tablename__ = 'puzzles'

    @staticmethod
    def from_list(cels):
        entity = Puzzle()
        entity.grid_a = cels[0]
        entity.grid_b = cels[1]
        entity.grid_c = cels[2]
        entity.grid_d = cels[3]
        entity.grid_e = cels[4]
        entity.grid_f = cels[5]
        entity.grid_g = cels[6]
        entity.grid_h = cels[7]
        entity.grid_i = cels[8]
        return entity

    id = Column(Integer, primary_key=True)
    grid_a_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_a = relationship('Grid', foreign_keys=[grid_a_id])

    grid_b_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_b = relationship('Grid', foreign_keys=[grid_b_id])

    grid_c_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_c = relationship('Grid', foreign_keys=[grid_c_id])

    grid_d_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_d = relationship('Grid', foreign_keys=[grid_d_id])

    grid_e_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_e = relationship('Grid', foreign_keys=[grid_e_id])

    grid_f_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_f = relationship('Grid', foreign_keys=[grid_f_id])

    grid_g_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_g = relationship('Grid', foreign_keys=[grid_g_id])

    grid_h_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_h = relationship('Grid', foreign_keys=[grid_h_id])

    grid_i_id = Column(Integer, ForeignKey('grids.id'), nullable=False)
    grid_i = relationship('Grid', foreign_keys=[grid_i_id])
