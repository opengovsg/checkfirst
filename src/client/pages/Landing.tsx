import React, { FC } from 'react'
import { BiLogOutCircle, BiLogInCircle } from 'react-icons/bi'
import { Button, Box, VStack, HStack, Center, Flex } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../contexts'

export const Landing: FC = () => {
  const history = useHistory()
  const auth = useAuth()

  const logout = auth.logout
  const projects = () => history.push('/projects')
  const login = () => history.push('/login')

  return (
    <Flex direction="column" height="100vh">
      <Flex direction="row-reverse" w="100%" px={8} py={4}>
        {auth.isAuthenticated ? (
          <HStack>
            <Button onClick={projects} variant="ghost">
              Go to Projects
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
