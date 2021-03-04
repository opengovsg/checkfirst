import React, { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Flex, VStack, Box, Image } from '@chakra-ui/react'
import { OtpForm, LoginForm } from '../components'
import Masthead from '../components/Masthead'

import Logo from '../assets/checkfirst-logo.svg'

export const Login: FC = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')

  const handleLogin = () => history.push('/dashboard')

  return (
    <Flex direction="column" h="100vh" align="stretch">
      <Masthead />
      <Flex flex={1} direction="row">
        <Box
          flex={1}
          bg="#1B3C87"
          display={{ base: 'none', lg: 'block' }}
        ></Box>
        <Flex
          alignItems={{ base: 'flex-start', md: 'center' }}
          justifyContent="center"
          flex={2}
          padding={{ base: '64px 32px', md: '0px' }}
        >
          <VStack
            w={{ base: '100%', md: '460px' }}
            align="stretch"
            spacing="48px"
          >
            <Image src={Logo} w={{ base: '195px', md: '260px' }} />
            {!email ? (
              <OtpForm onSuccess={setEmail} />
            ) : (
              <LoginForm email={email} onLogin={handleLogin} />
            )}
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  )
}
