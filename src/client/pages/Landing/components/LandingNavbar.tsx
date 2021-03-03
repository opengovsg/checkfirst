import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, Box, HStack, Flex, Link, Image } from '@chakra-ui/react'

import Logo from '../../../assets/checkfirst-logo.svg'

export const LandingNavbar: FC<{ login: () => void }> = ({ login }) => (
  <Flex
    minH={{ base: '0px', md: '80px' }}
    justifyContent="space-between"
    alignItems="center"
    mb={{ base: '16px', md: '48px' }}
  >
    <RouterLink to="/">
      <Image
        width={{ base: '152px', lg: '206px' }}
        htmlHeight="24px"
        src={Logo}
      />
    </RouterLink>
    <HStack alignItems="center" direction="row" spacing="50px">
      <Box>
        <Link
          color="primary.500"
          href="https://guide.checkfirst.gov.sg"
          isExternal
        >
          Guide
        </Link>
      </Box>
      <Box display={{ base: 'none', md: 'initial' }}>
        <Button onClick={login} colorScheme="primary">
          Sign In
        </Button>
      </Box>
    </HStack>
  </Flex>
)
