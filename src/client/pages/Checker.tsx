import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Container, VStack, Box } from '@chakra-ui/react'

export const Checker: FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <Box bgColor="neutral.50" minH="100vh">
      <Container>
        <VStack py={4}>
          <Box layerStyle="card" w="100%" textStyle="h2">
            Checker: {id}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
