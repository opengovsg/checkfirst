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
import { Checker, Landing, Debug, Login, Projects, FormBuilder } from './pages'
import { AuthProvider, CheckerProvider } from './contexts'

const queryClient = new QueryClient()

const App: FC = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Switch>
              <Route exact path="/c/:id" component={Checker} />
              <Route exact path="/debug" component={Debug} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/" component={Landing} />

              <CheckerProvider>
                <Route exact path="/builder" component={FormBuilder} />
              </CheckerProvider>

              <PrivateRoute>
                <Route exact path="/projects" component={Projects} />
              </PrivateRoute>
              <Redirect to="/" />
            </Switch>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
