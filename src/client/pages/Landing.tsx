import React, { FC } from 'react'
import { Button, Box, VStack, Center, Flex } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../contexts'

export const Landing: FC = () => {
  const history = useHistory()
  const auth = useAuth()

  const login = () => history.push('/login')

  return (
    <Flex direction="column" height="100vh">
      <Flex direction="row-reverse" w="100%" px={8} py={4}>
        {auth.isAuthenticated ? (
          <Button colorScheme="primary">Logout</Button>
        ) : (
          <Button onClick={login} colorScheme="primary">
            Sign in
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
