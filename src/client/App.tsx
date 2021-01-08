import React, { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

import { theme } from './theme'
import { Checker, Landing } from './pages'

const App: FC = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/c/:id" component={Checker} />
          <Route exact path="/" component={Landing} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </ChakraProvider>
  )
}

export default App
