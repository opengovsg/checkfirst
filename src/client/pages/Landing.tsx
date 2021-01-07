import React, { FC } from 'react'
import { Box, VStack, Center } from '@chakra-ui/react'

export const Landing: FC = () => {
  return (
    <Center h="100vh">
      <VStack>
        <Box textStyle="h1">Checkfirst.gov.sg</Box>
        <Box>Don't know? Check first.</Box>
      </VStack>
    </Center>
  )
}
