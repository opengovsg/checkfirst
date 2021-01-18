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
import { Checker, Landing, Debug, Login, Projects } from './pages'
import { AuthProvider } from './contexts'

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
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />

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
