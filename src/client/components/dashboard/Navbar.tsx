import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { HStack, Text, Image, Tabs } from '@chakra-ui/react'

import Logo from '../../assets/checkfirst-logo.svg'
import { useAuth } from '../../contexts'
import { LogoutButton } from '../LogoutButton'
import { NavbarContainer } from '../common/navbar/NavbarContainer'
import { NavbarTabList } from '../common/navbar/NavbarTabList'
import { NavbarTab } from '../common/navbar/NavbarTab'

export const Navbar: FC = () => {
  const auth = useAuth()

  return (
    <NavbarContainer
      leftElement={
        <HStack spacing="94px">
          <RouterLink to="/">
            <Image htmlWidth="144px" src={Logo} />
          </RouterLink>
          <Tabs align="center" index={0}>
            <NavbarTabList>
              <NavbarTab key={0}>Projects</NavbarTab>
              <NavbarTab key={1} externalLink="https://guide.checkfirst.gov.sg">
                Guide
              </NavbarTab>
            </NavbarTabList>
          </Tabs>
        </HStack>
      }
      rightElement={
        <HStack spacing={8}>
          <Text>{auth.user?.email || 'Not signed in'}</Text>
          <LogoutButton />
        </HStack>
      }
    />
  )
}
