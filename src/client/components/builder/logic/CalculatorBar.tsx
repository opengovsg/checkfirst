import { Box, Flex, FlexProps, Text } from '@chakra-ui/layout'
import React, { FC } from 'react'

interface CalculatorBarProps extends Omit<FlexProps, 'onClick'> {
  onClick: (character: string) => void
}

export const CalculatorBar: FC<CalculatorBarProps> = ({
  onClick,
  ...props
}) => {
  const operands = '@+-×÷()^%>≥<≤=≠'.split('')
  const mappedOperands = '@,+,-,*,/,(,),^,%,>,>=,<,<=,==,!='.split(',')
  return (
    <Flex {...props}>
      {operands.map((char, index) => (
        <Box
          key={index}
          as="button"
          h="40px"
          w="40px"
          borderRadius="3px"
          _hover={{ bg: '#D6DEFF' }}
          _active={{ bg: '#B7C0E6' }}
          onClick={() => {
            onClick(`${mappedOperands[index]}`)
          }}
        >
          <Text fontFamily="monospace" fontSize="16px">
            {char}
          </Text>
        </Box>
      ))}
    </Flex>
  )
}
