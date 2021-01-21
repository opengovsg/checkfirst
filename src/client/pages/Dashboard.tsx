import React, { useState, FC, useEffect } from 'react'
import { Container, Flex, Grid, VStack } from '@chakra-ui/react'

import { ApiClient } from '../api'
import { Navbar, CreateNew, CheckerCard } from '../components/dashboard'
import { Checker } from '../../types/checker'

export const Dashboard: FC = () => {
  const [checkers, setCheckers] = useState<Checker[]>([])

  const loadCheckers = async () => {
    const response = await ApiClient.get('/c')
    setCheckers(response.data)
  }

  useEffect(() => {
    loadCheckers()
  }, [])

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar />
      <Container maxW="756px" pt="80px" px={0}>
        <VStack align="stretch" py={10} position="relative">
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            <CreateNew onSuccess={loadCheckers} />
            {checkers.map((checker) => {
              return (
                <CheckerCard
                  key={checker.id}
                  checker={checker}
                  onDelete={loadCheckers}
                  onDuplicate={loadCheckers}
                />
              )
            })}
          </Grid>
        </VStack>
      </Container>
    </Flex>
  )
}
