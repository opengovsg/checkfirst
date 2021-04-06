import React, { FC } from 'react'
import { Button, Text, VStack } from '@chakra-ui/react'

interface FallbackProps {
  resetError: () => void
}

export const Fallback: FC<FallbackProps> = ({ resetError }) => (
  <VStack align="center" justify="center" minH="100vh">
    <Text>Whoops, something went wrong.</Text>
    <Text mb="1rem">Click below to return to CheckFirst.</Text>
    <Button
      colorScheme="primary"
      onClick={() => {
        resetError()
      }}
    >
      Back to CheckFirst
    </Button>
  </VStack>
)
