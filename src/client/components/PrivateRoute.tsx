import React, { FC } from 'react'
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from 'react-router-dom'
import { useAuth } from '../contexts'

export const PrivateRoute: FC<RouteProps> = ({
  children,
  component: Component,
  ...rest
}) => {
  if (!children && !Component)
    throw new Error('Either children or component is required.')

  const { user } = useAuth()
  const renderRoute = (props: RouteComponentProps) =>
    user ? (
      children || (Component && <Component {...props} />)
    ) : (
      <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )
  return <Route {...rest} render={renderRoute} />
}
