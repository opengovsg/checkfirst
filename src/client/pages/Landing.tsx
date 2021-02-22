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
  Stack,
  Container,
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
      h="80px"
      w="100%"
      pt="47px"
      zIndex={999}
      direction="row"
      justifyContent="space-between"
      bgColor="neutral.100"
      alignItems="center"
    >
      <Image htmlWidth="206px" htmlHeight="24px" src={Logo} />
      <Stack alignItems="center" direction="row">
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
      </Stack>
    </Flex>
  )
  const Footer = () => (
    <>
      <Stack
        h="128px"
        px="10vw"
        direction="row"
        justifyContent="space-between"
        bgColor="primary.500"
        color="neutral.100"
      >
        <Stack alignItems="center" direction="row">
          <Text fontSize="24px" fontWeight="600">
            CheckFirst
          </Text>
          <Text fontStyle="italic">Don't Know? CheckFirst.</Text>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          minW="460px"
          justifyContent="space-between"
        >
          <Link href="https://guide.checkfirst.gov.sg" isExternal>
            User Guide
          </Link>
          <Text>Privacy</Text>
          <Text>Terms of Use</Text>
          <Link href="https://www.tech.gov.sg/report_vulnerability" isExternal>
            Report Vulnerability
          </Link>
        </Stack>
      </Stack>
      <HStack
        h="128px"
        px="10vw"
        direction="row"
        bgColor="neutral.100"
        color="grey"
        fontSize="10px"
      >
        <VStack justifyContent="left">
          <Text width="100%">Built by</Text>
          <Link href="https://open.gov.sg" isExternal>
            <Image htmlWidth="160px" htmlHeight="47px" src={OGP} />
          </Link>
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
    <Flex direction="column" height="100vh" bgColor="neutral.100">
      <Container maxW="80vw" bgColor="neutral.100">
        <LandingNavbar />
        <HStack bgColor="neutral.100" pb="200px">
          <VStack pt="20vh" alignItems="left">
            <Box textStyle="hero">Don't Know?</Box>
            <Box textStyle="hero">CheckFirst.</Box>
            <Button mt="5vh !important" colorScheme="primary" width="120px">
              Learn More
            </Button>
          </VStack>
          <HStack h="100%" flex={1} justifyContent="center" />
        </HStack>
      </Container>
      <Footer />
    </Flex>
  )
}
