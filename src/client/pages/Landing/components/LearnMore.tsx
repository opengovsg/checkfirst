import React, { FC } from 'react'
import {
  VStack,
  HStack,
  Image,
  Text,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react'

import { Section } from './Section'
import Build from '../../../assets/landing/build.svg'
import Share from '../../../assets/landing/share.svg'
import UpdateLogic from '../../../assets/landing/update-logic.svg'

export const LearnMore: FC = () => {
  const sectionHeader = useBreakpointValue({
    base: 'h2',
    lg: 'display2',
  })
  const infoHeader = useBreakpointValue({
    base: 'h3',
    lg: 'h2',
  })

  const Info = ({
    image,
    title,
    children,
    reverse = false,
  }: {
    image?: string
    title: string
    children: React.ReactNode
    reverse?: boolean
  }) => (
    <Stack
      direction={{ base: 'column', md: reverse ? 'row-reverse' : 'row' }}
      spacing={{ base: '32px', lg: '0px' }}
    >
      <HStack flex={1} justifyContent={reverse ? 'flex-end' : 'flex-start'}>
        <Image src={image} />
      </HStack>
      <VStack flex={1} alignItems="left" justifyContent="center">
        <Text textStyle={infoHeader}>{title}</Text>
        <Text color="primary.500">{children}</Text>
      </VStack>
    </Stack>
  )

  return (
    <Section id="learn-more" bg="white">
      <VStack align="stretch" spacing="64px" py="64px">
        <Text
          textAlign={{ base: 'left', md: 'center' }}
          textStyle={sectionHeader}
        >
          Why use CheckFirst?
        </Text>
        <Info image={Build} title="Build your own eligibility checker">
          Use our form and logic builder to build eligibility checkers,
          calculators, and even quizzes. Instant onboarding for government
          officers. Login using your @agency.gov.sg email address.
        </Info>

        <Info
          image={UpdateLogic}
          title="Instant changes and deployments"
          reverse
        >
          Maintaining an eligibility checker, calculator, or quiz is a breeze
          with CheckFirst. Update the logic on your own rather than having
          multiple meetings with vendors. No HTML coding for the policy owners
          of the eligiblity checkers. Have changes immediately reflected on the
          website that has the embedded checker.
        </Info>

        <Info image={Share} title="Share the checker with a subset of viewers">
          Not everything can be and should be published on the agency website.
          CheckFirst makes it easy for agencies to share a checker through a
          shareable link.
        </Info>
      </VStack>
    </Section>
  )
}
