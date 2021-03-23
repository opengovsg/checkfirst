import React, { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

import { theme } from './theme'
import { PrivateRoute } from './components'
import { Checker, Landing, Login, Dashboard, FormBuilder } from './pages'
import {
  AuthProvider,
  CheckerProvider,
  GoogleAnalyticsProvider,
} from './contexts'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const App: FC = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <GoogleAnalyticsProvider>
            <AuthProvider>
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
            </AuthProvider>
          </GoogleAnalyticsProvider>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
export default App
