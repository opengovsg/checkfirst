import React, { FC } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import {
  Tabs,
  TabList,
  Tab,
  IconButton,
  Button,
  Flex,
  HStack,
} from '@chakra-ui/react'

import { LogoutButton } from '../LogoutButton'

export type NavbarProps = {
  onTabsChange: (index: number) => void
}

export const Navbar: FC<NavbarProps> = ({ onTabsChange }: NavbarProps) => {
  return (
    <Flex
      h="80px"
      direction="row"
      bgColor="white"
      px={10}
      alignItems="center"
      position="fixed"
      w="100%"
    >
      <HStack>
        <IconButton aria-label="Back" variant="ghost" icon={<BiArrowBack />} />
        <Button variant="ghost">Untitled Project</Button>
      </HStack>
      <HStack h="100%" flex={1} justifyContent="center" spacing={0}>
        <Tabs
          onChange={onTabsChange}
          w="250px"
          h="100%"
          align="center"
          colorScheme="primary"
          isFitted
        >
          <TabList h="100%">
            <Tab borderBottom="solid 4px">
              <strong>Questions</strong>
            </Tab>
            <Tab borderBottom="solid 4px">
              <strong>Logic</strong>
            </Tab>
          </TabList>
        </Tabs>
      </HStack>
      <HStack>
        <Button colorScheme="primary">Save</Button>
        <LogoutButton />
      </HStack>
    </Flex>
  )
}
