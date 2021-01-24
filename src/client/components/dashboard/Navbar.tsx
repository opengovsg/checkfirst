import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Flex, HStack, Text, Link, Image } from '@chakra-ui/react'

import Logo from '../../assets/checkfirst-logo.svg'
import { useAuth } from '../../contexts'
import { LogoutButton } from '../LogoutButton'

export const Navbar: FC = () => {
  const auth = useAuth()
  return (
    <Flex
      h="80px"
      direction="row"
      bgColor="white"
      px={10}
      alignItems="center"
      position="fixed"
      w="100%"
      zIndex={999}
    >
      <HStack>
        <RouterLink to="/">
          <Image htmlWidth="144px" src={Logo} />
        </RouterLink>
      </HStack>
      <HStack h="100%" flex={1} justifyContent="center" />
      <HStack>
        <Link href="https://guide.checkfirst.gov.sg" mr={6} isExternal>
          Guide
        </Link>
        <Text>{auth.user?.email || 'Not signed in'}</Text>
        <LogoutButton />
      </HStack>
    </Flex>
  )
}
