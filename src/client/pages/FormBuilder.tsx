import React, { FC } from 'react'
import { BiPlusCircle } from 'react-icons/bi'
import { Container, Flex, VStack } from '@chakra-ui/react'

import { FloatingToolbar, Navbar } from '../components/builder'

export const FormBuilder: FC = () => {
  const toolbarOptions = [
    { icon: <BiPlusCircle />, onClick: () => console.log('clicked') },
  ]

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar />
      <Container maxW="756px" pt="80px" px={0}>
        <VStack align="stretch" py={10} position="relative">
          <FloatingToolbar offsetTop={0} options={toolbarOptions} />

          <Flex layerStyle="builderField">Dummy field</Flex>
        </VStack>
      </Container>
    </Flex>
  )
}
