import { Box, Flex, FlexProps, HStack, Text } from '@chakra-ui/layout'
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
      <HStack spacing="0" px="16px">
        {operands.map((char, index) => (
          <Box
            key={index}
            as="button"
            h="40px"
            w="40px"
            _hover={{ fontWeight: 'bold' }}
            onClick={() => {
              onClick(`${mappedOperands[index]}`)
            }}
          >
            <Text fontFamily="monospace" fontSize="16px">
              {char}
            </Text>
          </Box>
        ))}
      </HStack>
    </Flex>
  )
}
