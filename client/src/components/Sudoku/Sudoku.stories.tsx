/* eslint-disable */
import React from 'react'
import { storiesOf } from '@storybook/react'
import Sudoku from './Sudoku'

storiesOf('Sudoku', module).add('default', () => <Sudoku sudoku={[[]]} />)
