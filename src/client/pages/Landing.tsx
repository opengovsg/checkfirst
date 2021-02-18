import React, { FC } from 'react'
import { Redirect } from 'react-router-dom'
import { BiLogInCircle } from 'react-icons/bi'
import { ImLinkedin2, ImFacebook } from 'react-icons/im'
import {
  Button,
  Box,
  VStack,
  HStack,
  Flex,
  Link,
  Image,
  Text,
} from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

import Logo from '../assets/checkfirst-logo.svg'
import OGP from '../assets/ogp-logo.svg'

import { useAuth } from '../contexts'

export const Landing: FC = () => {
  const history = useHistory()
  const auth = useAuth()

  const login = () => history.push('/login')
  const LandingNavbar = () => (
    <Flex
      pt="47px"
      h="80px"
      direction="row"
      bgColor="neutral.100"
      px="10vw"
      alignItems="center"
      w="100%"
      zIndex={999}
    >
      <Image htmlWidth="206px" htmlHeight="24px" src={Logo} />
      <HStack h="100%" flex={1} justifyContent="center" />
      <Link href="https://guide.checkfirst.gov.sg" mr="3vw" isExternal>
        Guide
      </Link>
      <Button
        onClick={login}
        colorScheme="primary"
        rightIcon={<BiLogInCircle />}
      >
        Sign In
      </Button>
    </Flex>
  )
  const Footer = () => (
    <>
      <HStack
        my="auto"
        h="128px"
        px="10vw"
        direction="row"
        bgColor="primary.500"
        color="neutral.100"
      >
        <Text fontSize="24px" fontWeight="600">
          CheckFirst
        </Text>
        <Text ml="1vw !important" fontStyle="italic">
          Don't Know? CheckFirst.
        </Text>
        <HStack h="100%" flex={1} justifyContent="center" />
        <HStack flex={1} minWidth="460px">
          <Link mx="auto" href="https://guide.checkfirst.gov.sg" isExternal>
            User Guide
          </Link>
          <Text mx="auto">Privacy</Text>
          <Text mx="auto">Terms of Use</Text>
          <Link
            mr="0"
            href="https://www.tech.gov.sg/report_vulnerability"
            isExternal
          >
            Report Vulnerability
          </Link>
        </HStack>
      </HStack>
      <HStack
        my="auto"
        h="128px"
        px="10vw"
        direction="row"
        bgColor="neutral.100"
        color="grey"
        fontSize="10px"
      >
        <VStack justifyContent="left">
          <Text width="100%">Built by</Text>
          <Image htmlWidth="160px" htmlHeight="47px" src={OGP} />
        </VStack>
        <HStack h="100%" flex={1} justifyContent="center" />
        <VStack>
          <HStack mt="30px" mb="8px" w="100%">
            <HStack flex={1} />
            <Link
              href="https://www.linkedin.com/company/open-government-products/"
              isExternal
            >
              <ImLinkedin2 color="black" size="24px" />
            </Link>
            <Link href="https://www.facebook.com/opengovsg" isExternal>
              <ImFacebook color="black" size="24px" />
            </Link>
          </HStack>
          <Text>
            © 2020 Open Government Products, Government Technology Agency of
            Singapore
          </Text>
        </VStack>
      </HStack>
    </>
  )
  return auth.user ? (
    <Redirect to="/dashboard" />
  ) : (
    <Flex direction="column" height="100vh">
      <LandingNavbar />
      <HStack bgColor="neutral.100" pb="200px">
        <VStack pl="10vw" pt="20vh" alignItems="left">
          <Box textStyle="hero">Don't Know?</Box>
          <Box textStyle="hero">CheckFirst.</Box>
          <Button mt="5vh !important" colorScheme="primary" width="120px">
            Learn More
          </Button>
        </VStack>
        <HStack h="100%" flex={1} justifyContent="center" />
      </HStack>
      <Footer />
    </Flex>
  )
}
