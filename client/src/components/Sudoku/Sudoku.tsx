import React from 'react'
import styles from './Sudoku.module.scss'

const Sudoku: React.FC<{ sudoku: number[][] }> = ({ sudoku }) => (
  <div className={styles.Sudoku}>
    {sudoku.map((_, i) => (
      <div className={styles.row} key={i}>
        {sudoku.map((_, j) => (
          <div className={styles.col} key={i + ':' + j}>
            {sudoku[i][j]}
          </div>
        ))}
      </div>
    ))}
  </div>
)

export default Sudoku
