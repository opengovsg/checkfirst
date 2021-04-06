import React, { FC } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { Center, Flex, Spinner } from '@chakra-ui/react'

import { Checker as CheckerComponent } from '../components'
import { CheckerService } from '../services'

export const Checker: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { isLoading, isError, data: config } = useQuery(['checker', id], () =>
    CheckerService.getPublishedChecker(id)
  )

  return (
    <Flex direction="column" bg="neutral.50" minH="100vh">
      {!isLoading && !isError && config && <CheckerComponent config={config} />}
      {isLoading && (
        <Center py={16}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
        </Center>
      )}
      {isError && <Center py={16}>Oops an error has occurred!</Center>}
    </Flex>
  )
}
