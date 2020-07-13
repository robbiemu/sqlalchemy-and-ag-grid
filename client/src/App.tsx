import React from 'react'
import { AppRoutes, RenderRoutes, AppRoute } from './routes'
import { Link } from 'react-router-dom'

function App () {
  const app = AppRoutes.find(route => route.key === 'APP') || { routes: [] }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'stretch' }}>
      <div style={{ flex: 0.3, backgroundColor: '#f2f2f2' }}>
        <h2>route menu</h2>
        <ul>
          {(app as any).routes.map((route: AppRoute, index: number) => (
            <li key={'route_' + index}>
              <Link to={route.path}>{route.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <RenderRoutes routes={AppRoutes} />
      </div>
    </div>
  )
}

export default App
