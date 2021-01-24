import React, { FC } from 'react'
import { Redirect } from 'react-router-dom'
import { BiLogOutCircle, BiLogInCircle } from 'react-icons/bi'
import { Button, Box, VStack, HStack, Center, Flex } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../contexts'

export const Landing: FC = () => {
  const history = useHistory()
  const auth = useAuth()

  const logout = auth.logout
  const dashboard = () => history.push('/dashboard')
  const login = () => history.push('/login')

  if (auth.user) return <Redirect to="/dashboard" />

  return (
    <Flex direction="column" height="100vh">
      <Flex direction="row-reverse" w="100%" px={8} py={4}>
        {auth.user ? (
          <HStack>
            <Button onClick={dashboard} variant="ghost">
              Go to Dashboard
            </Button>
            <Button
              onClick={logout}
              colorScheme="primary"
              rightIcon={<BiLogOutCircle />}
            >
              Sign Out
            </Button>
          </HStack>
        ) : (
          <Button
            onClick={login}
            colorScheme="primary"
            rightIcon={<BiLogInCircle />}
          >
            Sign In
          </Button>
        )}
      </Flex>
      <Center flex="1">
        <VStack>
          <Box textStyle="h1">CheckFirst.gov.sg</Box>
          <Box>Don't Know? CheckFirst.</Box>
        </VStack>
      </Center>
    </Flex>
  )
}
