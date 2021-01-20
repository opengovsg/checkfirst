import React, { FC } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { IconButton, Button, Flex, HStack } from '@chakra-ui/react'

import { LogoutButton } from '../LogoutButton'

export const Navbar: FC = () => {
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
        <IconButton aria-label="Back" variant="ghost" icon={<BiArrowBack />} />
        <Button variant="ghost">Untitled Project</Button>
      </HStack>
      <HStack h="100%" flex={1} justifyContent="center" spacing={0}>
        <Button
          borderRadius={0}
          h="100%"
          w="120px"
          variant="ghost"
          borderBottom="solid 4px black"
        >
          Questions
        </Button>
        <Button
          borderRadius={0}
          h="100%"
          w="120px"
          variant="ghost"
          borderBottom="solid 4px white"
        >
          Logic
        </Button>
      </HStack>
      <HStack>
        <Button colorScheme="primary">Save</Button>
        <LogoutButton />
      </HStack>
    </Flex>
  )
}
