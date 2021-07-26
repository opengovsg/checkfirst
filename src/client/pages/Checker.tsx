import React, { FC } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'
import {
  Box,
  Center,
  Flex,
  Spinner,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react'

import Masthead from '../components/Masthead'
import { Checker as CheckerComponent } from '../components'
import { CheckerService } from '../services'

// Images
import notFoundErrorImage from '../assets/states/error-404.svg'
import Logo from '../assets/checkfirst-logo.svg'

export const Checker: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const {
    isLoading,
    isError,
    data: config,
  } = useQuery(['checker', id], () => CheckerService.getPublishedChecker(id))

  return (
    <Flex direction="column" bg="neutral.200" minH="100vh">
      {!query.get('embed') && <Masthead />}
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
            <Text textStyle="heading2" color="primary.500">
              There’s nothing here.
            </Text>
            <Text textStyle="body1">
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
