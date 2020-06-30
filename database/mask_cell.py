from database.data_source import Base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey


class MaskCell(Base):
    __tablename__ = 'maskcells'

    id = Column(Integer, primary_key=True)
    mask_id = Column(Integer, ForeignKey('masks.id'), nullable=False)
    mask = relationship('Mask')

    x = Column(Integer, nullable=False)
    y = Column(Integer, nullable=False)
