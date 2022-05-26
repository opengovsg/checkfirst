import React, { FC } from 'react'
import { VStack, HStack, Link, Image, Text, Stack } from '@chakra-ui/react'
import { ImLinkedin2, ImFacebook } from 'react-icons/im'
import { format } from 'date-fns-tz'

import { Section } from './Section'
import OGP from '../../../assets/ogp-logo.svg'

export const OgpFooter: FC = () => (
  <Section bg="neutral.100">
    <Stack
      py={{ base: '48px', md: '24px' }}
      direction={{ base: 'column', md: 'row' }}
      justifyContent={{ md: 'space-between' }}
      alignItems={{ md: 'flex-end' }}
      color="#000000"
      fontSize="10px"
      spacing={{ base: '48px', md: '0px]' }}
    >
      <VStack
        justifyContent="flex-start"
        alignItems={{ base: 'flex-start', md: 'center' }}
      >
        <Text width="100%">Built by</Text>
        <Link href="https://open.gov.sg" isExternal>
          <Image htmlWidth="160px" htmlHeight="47px" src={OGP} />
        </Link>
      </VStack>

      <VStack align="stretch">
        <HStack justifyContent={{ md: 'flex-end' }}>
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
          © {format(Date.now(), 'yyyy')} Open Government Products, Government
          Technology Agency of Singapore
        </Text>
      </VStack>
    </Stack>
  </Section>
)
