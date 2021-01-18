import React, { FC } from 'react'
import { Stack, Button, Box, VStack, Center } from '@chakra-ui/react'

export const Landing: FC = () => {
  return (
    <VStack>
      <Stack w="100vw" direction="row" spacing={2}>
        <Box flex="1" />
        <Button color="primary">Sign In</Button>
      </Stack>
      <Center h="100vh">
        <VStack>
          <Box textStyle="h1">CheckFirst.gov.sg</Box>
          <Box>Don't Know? CheckFirst.</Box>
        </VStack>
      </Center>
    </VStack>
  )
}
