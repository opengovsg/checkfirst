import { BiChevronDown, BiLinkExternal } from 'react-icons/bi'
import {
  Container,
  Flex,
  Link,
  Image,
  Icon,
  HStack,
  VStack,
  Stack,
  Text,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { FC } from 'react'

import LionHeadSymbol from '../assets/lion-head-symbol.svg'
import Lock from '../assets/svg-icons/bxs-lock-alt.svg'
import Bank from '../assets/svg-icons/bxs-bank.svg'

interface MastheadProps {
  width?: string
}

export const Masthead: FC<MastheadProps> = ({ width }) => {
  const { isOpen, onToggle } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Flex bg="#E5E5E5" direction="column" position="relative" zIndex="banner">
      <Container
        width={{ base: '100%', md: width ?? '93vw' }}
        maxW={{ base: '100%', md: width ?? '93vw' }}
        py={{ base: '8px', md: '4px' }}
        layerStyle="app"
        borderBottom={isOpen ? { base: 'solid 1px #C9CCCF', md: '0px' } : '0px'}
      >
        <Flex>
          <Image mr={{ base: '18px', md: '16px' }} src={LionHeadSymbol} />
          <Flex
            flex={1}
            direction="row"
            fontSize={{ base: '12px', md: '14px' }}
            lineHeight={{ base: '16px', md: '20px' }}
            fontFamily="Lato"
          >
            <Text>
              A Singapore government agency website.
              {isMobile && <br />}
              <Link
                ml="4px"
                color="#2F60CE"
                textDecor="underline"
                onClick={onToggle}
              >
                How to identify it? <Icon boxSize="16px" as={BiChevronDown} />
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Container>
      {isOpen && (
        <Container
          width={{ base: '100%', md: width ?? '93vw' }}
          maxW={{ base: '100%', md: width ?? '93vw' }}
          layerStyle="app"
        >
          <Stack
            py={{ base: '12px', md: '44px' }}
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: '16px', md: '200px' }}
          >
            <HStack
              w={{ base: '100%', md: '468px' }}
              alignItems="top"
              spacing={{ base: '18px', md: '16px' }}
            >
              <Image boxSize={{ base: '16px', md: '24px' }} src={Bank} />
              <VStack
                flex={1}
                align="stretch"
                spacing={{ base: '8px', md: '12px' }}
              >
                <Text
                  fontFamily="Lato"
                  fontWeight={700}
                  fontSize={{ base: '12px', md: '16px' }}
                  lineHeight={{ base: '16px', md: '24px' }}
                >
                  Official website links end with .gov.sg
                </Text>
                <Text
                  fontFamily="Lato"
                  fontWeight={400}
                  fontSize={{ base: '12px', md: '16px' }}
                  lineHeight={{ base: '16px', md: '24px' }}
                >
                  Government agencies communicate via .gov.sg websites (e.g.
                  go.gov.sg/open).{' '}
                  <Link color="#2F60CE" textDecor="underline" href="#">
                    Trusted websites <Icon as={BiLinkExternal} />
                  </Link>
                </Text>
              </VStack>
            </HStack>

            <HStack
              w={{ base: '100%', md: '468px' }}
              alignItems="top"
              spacing={{ base: '18px', md: '16px' }}
            >
              <Image boxSize={{ base: '16px', md: '24px' }} src={Lock} />
              <VStack
                flex={1}
                align="stretch"
                spacing={{ base: '8px', md: '12px' }}
              >
                <Text
                  fontFamily="Lato"
                  fontWeight={700}
                  fontSize={{ base: '12px', md: '16px' }}
                  lineHeight={{ base: '16px', md: '24px' }}
                >
                  Secure websites use HTTPS
                </Text>
                <Text
                  fontFamily="Lato"
                  fontWeight={400}
                  fontSize={{ base: '12px', md: '16px' }}
                  lineHeight={{ base: '16px', md: '24px' }}
                >
                  Look for a lock (
                  <Image
                    boxSize={{ base: '10px', md: '14px' }}
                    display="inline"
                    src={Lock}
                  />
                  ) or
                  {' https://'} as an added precaution. Share sensitive
                </Text>
              </VStack>
            </HStack>
          </Stack>
        </Container>
      )}
    </Flex>
  )
}

export default Masthead
