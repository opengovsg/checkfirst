import { Circle, Flex, Link } from '@chakra-ui/react'
import React, { FC } from 'react'
import { BiQuestionMark } from 'react-icons/bi'
import { DefaultTooltip } from '../common/DefaultTooltip'

export const HelpButton: FC = () => {
  return (
    <>
      <Flex position="fixed" left="40px" bottom="40px">
        <Link href="https://guide.checkfirst.gov.sg" isExternal>
          <DefaultTooltip label="Help & Resources" placement="right">
            <Circle size="40px" bg="primary.500" color="white">
              <BiQuestionMark size="24px" />
            </Circle>
          </DefaultTooltip>
        </Link>
      </Flex>
    </>
  )
}
