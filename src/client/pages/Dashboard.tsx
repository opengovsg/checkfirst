import React, { FC } from 'react'
import { useQuery } from 'react-query'
import {
  Container,
  Flex,
  SimpleGrid,
  Center,
  Spinner,
  VStack,
} from '@chakra-ui/react'

import { ApiClient } from '../api'
import { Navbar, CreateNew, CheckerCard } from '../components/dashboard'
import { Checker } from '../../types/checker'

export const Dashboard: FC = () => {
  const { isLoading, data: checkers } = useQuery('checkers', async () => {
    const response = await ApiClient.get('/c')
    return (response.data || []) as Checker[]
  })

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar />
      <Container maxW="960px" pt="80px" px={0}>
        <VStack align="stretch" py={10} position="relative">
          {isLoading ? (
            <Center>
              <Spinner thickness="4px" color="primary.500" size="xl" />
            </Center>
          ) : (
            <SimpleGrid columns={5} spacing={8}>
              <CreateNew />
              {checkers?.map((checker) => {
                return <CheckerCard key={checker.id} checker={checker} />
              })}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Flex>
  )
}
