import { OutboundLink } from 'react-ga'
import { Circle, Flex } from '@chakra-ui/react'
import React, { FC } from 'react'
import { BiQuestionMark } from 'react-icons/bi'
import { useGoogleAnalytics } from '../../contexts'
import { DefaultTooltip } from '../common/DefaultTooltip'

export const HelpButton: FC = () => {
  const { GA_USER_EVENTS } = useGoogleAnalytics()
  return (
    <>
      <Flex position="fixed" left="40px" bottom="40px">
        <OutboundLink
          to="https://guide.checkfirst.gov.sg"
          target="_blank"
          eventLabel={GA_USER_EVENTS.BUILDER_HELP_BUTTON}
        >
          <DefaultTooltip label="Help & Resources">
            <Circle size="40px" bg="primary.500" color="white">
              <BiQuestionMark size="24px" />
            </Circle>
          </DefaultTooltip>
        </OutboundLink>
      </Flex>
    </>
  )
}
