import React, { FC } from 'react'
import { Link, Text, Stack, Divider } from '@chakra-ui/react'

import { Section } from './Section'

export const SiteMap: FC = () => (
  <Section bg="primary.500">
    <Stack
      color="neutral.100"
      py="48px"
      direction={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ base: 'flex-start', md: 'center' }}
      spacing={{ base: '32px', md: '0px' }}
    >
      <Stack
        alignItems={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        spacing={{ base: '8px', md: '16px' }}
      >
        <Text fontSize="24px" fontWeight="600">
          CheckFirst
        </Text>
        <Text fontStyle="italic">Don't Know? CheckFirst.</Text>
      </Stack>
      <Divider display={{ md: 'none' }} />
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing="16px"
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
  </Section>
)
