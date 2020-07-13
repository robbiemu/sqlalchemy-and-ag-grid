import Samples from './routable_components/samples/Samples'
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom' // <-- New code
import Random from './routable_components/random/Random'

export interface AppRoute {
  key: string
  name?: string
  path: string
  exact: boolean
  component: Function
  routes: AppRoute[]
}

export const AppRoutes = [
  {
    path: '/',
    key: 'ROOT',
    name: 'home',
    exact: true,
    component: () => <Redirect to={'/app/samples'} /> // Stats
  },
  {
    path: '/app',
    key: 'APP',
    exact: false,
    component: RenderRoutes,
    routes: [
      {
        path: '/app/samples',
        key: 'SAMPLES',
        name: 'samples',
        component: Samples
      },
      {
        path: '/app/random',
        key: 'RANDOM',
        name: 'random',
        exact: true,
        component: Random
      },
      {
        path: '/app/puzzle',
        key: 'PUZZLE',
        name: 'puzzle',
        component: Samples
      },
      {
        path: '/app/new',
        key: 'NEW',
        name: 'new',
        component: Samples
      }
    ]
  }
]

/**
 * Use this component for any new section of routes (any config object that has a "routes" property
 */
export function RenderRoutes ({ routes }: { routes: Array<AppRoute> } & any) {
  return (
    <Switch>
      {routes.map((route: AppRoute, i: number) => {
        return <RouteWithSubRoutes key={route.key} {...route} />
      })}
      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  )
}

/**
 * Render a route with potential sub routes
 * https://reacttraining.com/react-router/web/example/route-config
 */
function RouteWithSubRoutes (route: AppRoute) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  )
}
