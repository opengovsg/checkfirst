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
  useBreakpointValue,
} from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

import Logo from '../assets/checkfirst-logo.svg'
import OGP from '../assets/ogp-logo.svg'

import Main from '../assets/landing/main.svg'
import Build from '../assets/landing/build.svg'
import Share from '../assets/landing/share.svg'
import UpdateLogic from '../assets/landing/update-logic.svg'
import StartToday from '../assets/landing/start-today.svg'

import { useAuth } from '../contexts'

export const Landing: FC = () => {
  const history = useHistory()
  const auth = useAuth()
  const navbarDirection = {
    base: 'column' as const,
    sm: 'row' as const,
  }
  const heroPadding = {
    base: '10vh',
    md: '0vh',
  }
  const rowBreakpoint = {
    base: 'column' as const,
    md: 'row' as const,
  }
  const rowReverseBreakpoint = {
    base: 'column' as const,
    md: 'row-reverse' as const,
  }
  const startTodayTextWidth = {
    base: '100%',
    md: '70%',
  }
  const startTodayImageWidth = {
    base: '100%',
    md: '30%',
  }
  const appFooterJustify = {
    base: 'center',
    md: 'space-between',
  }
  const footerLinksDirection = {
    base: 'column' as const,
    sm: 'row' as const,
  }
  const footerLinksMinWidth = {
    base: '0px',
    sm: '460px',
  }

  const login = () => history.push('/login')

  const learnMore = () => {
    const element = document.getElementById('learn-more')
    window.scrollTo({
      behavior: element ? 'smooth' : 'auto',
      top: element ? element.offsetTop : 0,
    })
  }

  const LandingNavbar = () => (
    <Flex
      h="80px"
      w="100%"
      pt="47px"
      zIndex={999}
      direction={navbarDirection}
      justifyContent="space-between"
      bgColor="neutral.100"
      alignItems="center"
    >
      <Image htmlWidth="206px" htmlHeight="24px" src={Logo} />
      <Stack
        pt={{ base: '20px', sm: 0, md: 0 }}
        alignItems="center"
        direction="row"
      >
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
        h={{ md: '128px', sm: 'auto' }}
        py={{ md: 0, base: '10px' }}
        px="10vw"
        direction={rowBreakpoint}
        justifyContent={appFooterJustify}
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
          direction={footerLinksDirection}
          minWidth={footerLinksMinWidth}
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
    <Flex direction="column" bgColor="neutral.100">
      <Container maxW="80vw" bgColor="neutral.100">
        <LandingNavbar />
        <Stack direction={rowBreakpoint} pt={heroPadding} bgColor="neutral.100">
          <VStack justifyContent="center" alignItems="left">
            <Box
              textStyle="hero"
              fontSize={{ md: 'min(64px, 6vw)', sm: '64px', base: '40px' }}
              lineHeight={{ base: '48px', sm: '72px' }}
            >
              Don't Know?
            </Box>
            <Box
              textStyle="hero"
              fontSize={{ md: 'min(64px, 6vw)', sm: '64px', base: '40px' }}
              lineHeight={{ base: '48px', sm: '72px' }}
            >
              CheckFirst.
            </Box>
            <Button
              onClick={learnMore}
              mt={{ sm: '5vh !important' }}
              colorScheme="primary"
              width="120px"
            >
              Learn More
            </Button>
          </VStack>
          <HStack
            minW={{ md: '32px', base: '0px' }}
            h="100%"
            flex={1}
            alignItems="flex-end"
            flexDir="column"
          >
            <Image src={Main} />
          </HStack>
        </Stack>
      </Container>
      <Container id="learn-more" maxW="100vw" py="8vh" bgColor="neutral.50">
        <Container maxW="80vw">
          <Text textAlign="center" textStyle="h1">
            Why use CheckFirst?
          </Text>
          <Stack direction={rowBreakpoint} py="35px">
            <HStack w="100%">
              <Image src={Build} />
            </HStack>
            <VStack w="100%" alignItems="left" justifyContent="center">
              <Text textStyle="h2">Build your own eligibility checker</Text>
              <Text color="primary.500">
                Use our form and logic builder to build eligibility checkers,
                calculators, and even quizzes. Instant onboarding for government
                officers. Login using your @agency.gov.sg email address.
              </Text>
            </VStack>
          </Stack>
          <Stack direction={rowReverseBreakpoint} py="35px">
            <HStack w="100%" alignItems="flex-end" flexDir="column">
              <Image src={UpdateLogic} />
            </HStack>
            <VStack w="100%" alignItems="left" justifyContent="center">
              <Text textStyle="h2">Instant changes and deployments</Text>
              <Text color="primary.500">
                Maintaining an eligibility checker, calculator, or quiz is a
                breeze with CheckFirst. Update the logic on your own rather than
                having multiple meetings with vendors. No HTML coding for the
                policy owners of the eligiblity checkers. Have changes
                immediately reflected on the website that has the embedded
                checker.
              </Text>
            </VStack>
          </Stack>
          <Stack direction={rowBreakpoint} py="35px">
            <HStack w="100%">
              <Image src={Share} />
            </HStack>
            <VStack w="100%" alignItems="left" justifyContent="center">
              <Text textStyle="h2">
                Share the checker with a subset of viewers
              </Text>
              <Text color="primary.500">
                Not everything can be and should be published on the agency
                website. CheckFirst makes it easy for agencies to share a
                checker through a shareable link.
              </Text>
            </VStack>
          </Stack>
        </Container>
      </Container>
      <Container maxW="100vw" py="8vh" bgColor="neutral.100">
        <Container maxW="80vw">
          <Text textAlign="center" textStyle="h1" pb="3vh">
            Frequently Asked Questions
          </Text>
          <VStack w="100%" alignItems="left" justifyContent="center" py="3vh">
            <Text textStyle="h2">What can CheckFirst do?</Text>
            <Text color="primary.500">
              CheckFirst allows the user to build a custom eligibility checker,
              calculator, or quiz easily.
            </Text>
          </VStack>

          <VStack w="100%" alignItems="left" justifyContent="center" py="3vh">
            <Text textStyle="h2">What problems is CheckFirst solving?</Text>
            <Text color="primary.500">
              <strong>Non-standard eligibility checkers:</strong> Some agencies
              have Excel calculators while others use FAQs. From a citizen’s
              perspective, he or she just wants to know his or her eligiblity
              for a scheme.
            </Text>
            <Text color="primary.500">
              <strong>Long lead-time:</strong> Custom eligibility checkers take
              time and money to build. User relies on an outside IT team to
              build a customised solution that cannot scale or be reused.
            </Text>
            <Text color="primary.500">
              <strong>Tedious updates for multiple sites:</strong> The same
              government scheme might have to be updated across multiple
              websites. Manual errors can be introduced.
            </Text>
          </VStack>
        </Container>
      </Container>
      <Stack
        px="10vw"
        direction={rowBreakpoint}
        bgColor="#D6DEFF"
        color="primary.500"
      >
        <VStack
          w={startTodayTextWidth}
          alignItems="left"
          justifyContent="space-between"
          py="6vh"
        >
          <Text textStyle="h2">Start using CheckFirst today</Text>
          <Text color="primary.500">
            Sign in with your gov.sg email account. For non gov.sg email users,
            please fill out the following form. We will review your request
            within 3 business days.
          </Text>
          <Stack alignItems="center" direction="row">
            <Button
              onClick={login}
              colorScheme="primary"
              rightIcon={<BiLogInCircle />}
              mr="1vw"
            >
              Sign In
            </Button>
            <Text justifyContent="center">Have a question?</Text>
          </Stack>
        </VStack>
        <HStack w={startTodayImageWidth} alignItems="flex-end" flexDir="column">
          <Image src={StartToday} />
        </HStack>
      </Stack>
      <Footer />
    </Flex>
  )
}
