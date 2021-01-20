import React, { FC } from 'react'
import { Container, Flex, VStack } from '@chakra-ui/react'

import { Navbar } from '../components/projects'

export const Projects: FC = () => {
  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar />
      <Container maxW="756px" pt="80px" px={0}>
        <VStack align="stretch" py={10} position="relative">
          <Flex layerStyle="builderField">Dummy field</Flex>
        </VStack>
      </Container>
    </Flex>
  )
}
