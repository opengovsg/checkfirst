import React, { FC } from 'react'
import { Redirect } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../../contexts'
import {
  Hero,
  LearnMore,
  GetStarted,
  Faq,
  SiteMap,
  OgpFooter,
} from './components'
import Masthead from '../../components/Masthead'

export const Landing: FC = () => {
  const history = useHistory()
  const auth = useAuth()

  const login = () => history.push('/login')

  return auth.user ? (
    <Redirect to="/dashboard" />
  ) : (
    <>
      <Masthead />
      <Flex direction="column">
        <Hero login={login} />
        <LearnMore />
        <Faq />
        <GetStarted login={login} />
        <SiteMap />
        <OgpFooter />
      </Flex>
    </>
  )
}

export default Landing
