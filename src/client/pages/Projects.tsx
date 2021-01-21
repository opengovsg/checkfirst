import React, { FC } from 'react'
import { Box, Container, Flex, Grid, VStack } from '@chakra-ui/react'

import { Navbar, CreateNew } from '../components/projects'

export const Projects: FC = () => {
  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar />
      <Container maxW="756px" pt="80px" px={0}>
        <VStack align="stretch" py={10} position="relative">
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            <CreateNew />
            <Box w="100%" h="10" bg="blue.500" />
            <Box w="100%" h="10" bg="blue.500" />
            <Box w="100%" h="10" bg="blue.500" />
            <Box w="100%" h="10" bg="blue.500" />
            <Box w="100%" h="10" bg="blue.500" />
            <Box w="100%" h="10" bg="blue.500" />
            <Box w="100%" h="10" bg="blue.500" />
            <Box w="100%" h="10" bg="blue.500" />
          </Grid>
        </VStack>
      </Container>
    </Flex>
  )
}
