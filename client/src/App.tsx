import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { AgGridReact } from 'ag-grid-react'
import '../../server/node_modules/ag-grid-community/dist/styles/ag-grid.css'
import '../../server/node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css'

class App extends Component {
  state: Readonly<any>

  constructor (props: Readonly<{}>) {
    super(props)

    const indices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    const columnDefs = indices.forEach(x =>
      indices.forEach(y => ({
        headername: `grid ${x} position ${y}`,
        field: x + y
      }))
    )

    const puzzle = []
    const presentation = []

    axios.get('http://localhost:3000/games').then(res => rowData.push(...res))

    this.state = {
      columnDefs,
      rowData: []
    }
  }

  render () {
    return (
      <div
        className='ag-theme-alpine'
        style={{
          height: '250px',
          width: '600px'
        }}
      >
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
        ></AgGridReact>
      </div>
    )
  }
}

export default App
