import { Container, Flex, Link, Image, Text } from '@chakra-ui/react'
import React, { FC } from 'react'

import LionHeadSymbol from '../assets/lion-head-symbol.svg'

const SG_GOVT_LINK = 'https://www.gov.sg/'

export const Masthead: FC = () => {
  return (
    <Flex bg="#E5E5E5" py={1} position="relative" zIndex="banner">
      <Container width="93vw" maxWidth="93vw" layerStyle="app">
        <Link
          display="flex"
          justifyContent={{ base: 'center', md: 'inherit' }}
          isExternal
          href={SG_GOVT_LINK}
        >
          <Image src={LionHeadSymbol} />
          <Text ml="4px" fontSize="14px" fontFamily="Lato">
            A Singapore Government Agency Website
          </Text>
        </Link>
      </Container>
    </Flex>
  )
}

export default Masthead
