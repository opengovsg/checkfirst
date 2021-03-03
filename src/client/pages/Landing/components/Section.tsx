import React, { FC } from 'react'
import { Flex, Container } from '@chakra-ui/react'

export const Section: FC<{ id?: string; bg?: string }> = ({
  id,
  bg,
  children,
  ...rest
}) => (
  <Flex {...rest} bg={bg}>
    <Container id={id} maxW={{ base: '80vw', xl: '70vw' }} px={0}>
      {children}
    </Container>
  </Flex>
)
