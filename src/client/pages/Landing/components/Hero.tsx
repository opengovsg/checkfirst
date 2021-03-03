import React, { FC } from 'react'
import {
  Button,
  Box,
  VStack,
  HStack,
  Flex,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'

import { Section } from './Section'
import { LandingNavbar } from './LandingNavbar'
import Main from '../../../assets/landing/main.svg'

export const Hero: FC<{ login: () => void }> = ({ login }) => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const learnMore = () => {
    const element = document.getElementById('learn-more')
    window.scrollTo({
      behavior: element ? 'smooth' : 'auto',
      top: element ? element.offsetTop : 0,
    })
  }

  return (
    <Section bg="#F4F6F9">
      <Box my={{ base: '48px', lg: '0px' }}>
        <LandingNavbar login={login} />

        <Flex
          direction={{ base: 'column-reverse', md: 'row' }}
          justifyContent="space-between"
        >
          <VStack
            flex={1}
            justifyContent="center"
            alignItems="flex-start"
            spacing={{ base: '24px', md: '32px' }}
          >
            <Box>
              <Text textStyle="hero">Don't Know?</Text>
              <Text textStyle="hero">CheckFirst.</Text>
            </Box>
            <HStack>
              {isMobile ? (
                <>
                  <Button onClick={login} colorScheme="primary">
                    Sign In
                  </Button>
                  <Button
                    onClick={learnMore}
                    colorScheme="link"
                    color="primary.500"
                  >
                    Learn More
                  </Button>
                </>
              ) : (
                <Button onClick={learnMore} colorScheme="primary">
                  Learn More
                </Button>
              )}
            </HStack>
          </VStack>

          <Image
            flex={1}
            src={Main}
            height={{ base: '257px', lg: 'auto' }}
            mb={{ base: '24px', lg: '0px' }}
          />
        </Flex>
      </Box>
    </Section>
  )
}
