import React, { FC } from 'react'
import {
  Button,
  VStack,
  HStack,
  Image,
  Text,
  Link,
  Stack,
} from '@chakra-ui/react'

import { Section } from './Section'
import StartToday from '../../../assets/landing/start-today.svg'

export const GetStarted: FC<{ login: () => void }> = ({ login }) => (
  <Section bg="#D6DEFF">
    <Stack
      color="primary.500"
      direction={{ base: 'column', md: 'row' }}
      spacing={{ base: '16px', lg: '128px' }}
    >
      <VStack alignItems="flex-start" spacing="32px" py="64px">
        <VStack spacing="16px" align="stretch">
          <Text textStyle="heading2">Start using CheckFirst today</Text>
          <Text color="primary.500">
            Sign in with your gov.sg email account. For non gov.sg email users,
            please fill out the following form. We will review your request
            within 3 business days.
          </Text>
        </VStack>

        <HStack alignItems="center" spacing="24px">
          <Button onClick={login} colorScheme="primary">
            Sign In
          </Button>
          <Link href="https://guide.checkfirst.gov.sg" isExternal>
            Have a question?
          </Link>
        </HStack>
      </VStack>

      <Image src={StartToday} />
    </Stack>
  </Section>
)
