import React, { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
const history = createBrowserHistory()

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { theme } from './theme'
import { PrivateRoute, Fallback } from './components'
import { Checker, Landing, Login, Dashboard, FormBuilder } from './pages'
import {
  AuthProvider,
  CheckerProvider,
  GoogleAnalyticsProvider,
} from './contexts'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

Sentry.init({
  dsn: process.env.FRONTEND_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
  ],
  tracesSampleRate: 1.0,
})

const App: FC = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          <GoogleAnalyticsProvider>
            <AuthProvider>
              <Sentry.ErrorBoundary fallback={Fallback}>
                <Switch>
                  <Route exact path="/c/:id" component={Checker} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/" component={Landing} />
                  <PrivateRoute path="/dashboard" component={Dashboard} />
                  <PrivateRoute path="/builder/:id">
                    {/* TODO: Rename to BuilderProvider */}
                    <CheckerProvider>
                      <FormBuilder />
                    </CheckerProvider>
                  </PrivateRoute>
                  <Redirect to="/" />
                </Switch>
              </Sentry.ErrorBoundary>
            </AuthProvider>
          </GoogleAnalyticsProvider>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
export default App
