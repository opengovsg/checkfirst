import React, { FC } from 'react'
import {
  Box,
  VStack,
  Text,
  useBreakpointValue,
  OrderedList,
  ListItem,
} from '@chakra-ui/react'

import { Section } from './Section'

export const Faq: FC = () => {
  const sectionHeader = useBreakpointValue({
    base: 'heading2',
    lg: 'display2',
  })
  const infoHeader = useBreakpointValue({
    base: 'heading3',
    lg: 'heading2',
  })

  return (
    <Section bg="neutral.200">
      <VStack py="64px" align="stretch" spacing={{ base: '32px', md: '48px' }}>
        <Text
          color="primary.500"
          textAlign={{ base: 'left', md: 'center' }}
          textStyle={sectionHeader}
        >
          Frequently Asked Questions
        </Text>

        <VStack alignItems="left" justifyContent="center" spacing="16px">
          <Text color="primary.500" textStyle={infoHeader}>
            What can CheckFirst do?
          </Text>
          <Text color="primary.500">
            CheckFirst allows the user to build a custom eligibility checker,
            calculator, or quiz easily.
          </Text>
        </VStack>

        <VStack alignItems="left" justifyContent="center" spacing="16px">
          <Text color="primary.500" textStyle={infoHeader}>
            What problems are CheckFirst solving?
          </Text>
          <Box>
            <OrderedList spacing="16px">
              <ListItem pl={{ base: '16px', md: '48px' }} color="primary.500">
                <strong>Non-standard eligibility checkers:</strong> Some
                agencies have Excel calculators while others use FAQs. From a
                citizen’s perspective, he or she just wants to know his or her
                eligiblity for a scheme.
              </ListItem>

              <ListItem pl={{ base: '16px', md: '48px' }} color="primary.500">
                <strong>Long lead-time:</strong> Custom eligibility checkers
                take time and money to build. User relies on an outside IT team
                to build a customised solution that cannot scale or be reused.
              </ListItem>

              <ListItem pl={{ base: '16px', md: '48px' }} color="primary.500">
                <strong>Tedious updates for multiple sites:</strong> The same
                government scheme might have to be updated across multiple
                websites. Manual errors can be introduced.
              </ListItem>
            </OrderedList>
          </Box>
        </VStack>
      </VStack>
    </Section>
  )
}
