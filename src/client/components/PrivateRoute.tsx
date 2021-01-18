import React, { FC } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useAuth } from '../contexts'

export const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth()
  const renderRoute = ({ location }: RouteProps) =>
    isAuthenticated ? (
      children
    ) : (
      <Redirect to={{ pathname: '/login', state: { from: location } }} />
    )
  return <Route {...rest} render={renderRoute} />
}
