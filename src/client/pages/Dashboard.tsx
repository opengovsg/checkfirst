import React, { FC } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Container, Flex, Grid, Spinner, VStack } from '@chakra-ui/react'

import { ApiClient } from '../api'
import { Navbar, CreateNew, CheckerCard } from '../components/dashboard'
import { Checker } from '../../types/checker'

export const Dashboard: FC = () => {
  const { isLoading, data: checkers } = useQuery('checkers', async () => {
    const response = await ApiClient.get('/c')
    return (response.data || []) as Checker[]
  })
  const queryClient = useQueryClient()

  const refetchCheckers = () => {
    queryClient.refetchQueries('checkers')
  }

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar />
      <Container maxW="756px" pt="80px" px={0}>
        <VStack align="stretch" py={10} position="relative">
          {isLoading && <Spinner />}
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            <CreateNew onSuccess={refetchCheckers} />
            {checkers?.map((checker) => {
              return (
                <CheckerCard
                  key={checker.id}
                  checker={checker}
                  onDelete={refetchCheckers}
                  onDuplicate={refetchCheckers}
                />
              )
            })}
          </Grid>
        </VStack>
      </Container>
    </Flex>
  )
}
