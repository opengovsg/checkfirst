import React, { FC } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  Box,
  Center,
  Flex,
  Spinner,
  Image,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'

import { Checker as CheckerComponent } from '../components'
import { CheckerService } from '../services'

// Images
import notFoundErrorImage from '../assets/states/error-404.svg'
import Logo from '../assets/checkfirst-logo.svg'

export const Checker: FC = () => {
  const { id } = useParams<{ id: string }>()
  const {
    isLoading,
    isError,
    data: config,
  } = useQuery(['checker', id], () => CheckerService.getPublishedChecker(id))

  return (
    <Flex direction="column" bg="neutral.50" minH="100vh">
      {!isLoading && !isError && config && <CheckerComponent config={config} />}
      {isLoading && (
        <Center py={16}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
        </Center>
      )}
      {isError && (
        <Center py={16}>
          <VStack spacing={4}>
            <Image
              flex={1}
              src={notFoundErrorImage}
              height={{ base: '257px', lg: 'auto' }}
              mb={{ base: '24px', lg: '0px' }}
            />
            <Heading size="md" color="#1B3C87">
              There’s nothing here.
            </Heading>
            <Text>
              If you think this is a mistake, please contact the agency that
              gave you the checker link.
            </Text>
            <Box pt={32}>
              <Image htmlWidth="144px" src={Logo} />
            </Box>
          </VStack>
        </Center>
      )}
    </Flex>
  )
}

export default Checker
