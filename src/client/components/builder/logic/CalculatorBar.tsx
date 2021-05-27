import { Box, Flex, FlexProps, Text } from '@chakra-ui/layout'
import React, { FC, useState } from 'react'

interface CalculatorBarProps extends Omit<FlexProps, 'onClick'> {
  onClick: (character: string) => void
}

export const CalculatorBar: FC<CalculatorBarProps> = ({
  onClick,
  ...props
}) => {
  // use react useState hook to initialise the map only once upon initial render
  const [operatorMap] = useState(() => {
    const opMap = new Map<string, string>()
    opMap.set('@', '@')
    opMap.set('+', '+')
    opMap.set('×', '*')
    opMap.set('÷', '/')
    opMap.set('(', '(')
    opMap.set(')', ')')
    opMap.set('^', '^')
    opMap.set('%', '%')
    opMap.set('>', '>')
    opMap.set('≥', '>=')
    opMap.set('<', '<')
    opMap.set('≤', '<=')
    opMap.set('=', '==')
    opMap.set('≠', '!=')

    return opMap
  })

  const renderCalculatorButton = (
    index: number,
    operator: string,
    mappedOperator: string
  ) => (
    <Box
      key={index}
      as="button"
      h="40px"
      w="40px"
      borderRadius="3px"
      _hover={{ bg: '#D6DEFF' }}
      _active={{ bg: '#B7C0E6' }}
      onClick={() => {
        onClick(`${mappedOperator}`)
      }}
    >
      <Text fontFamily="monospace" fontSize="16px">
        {operator}
      </Text>
    </Box>
  )

  return (
    <Flex {...props}>
      {Array.from(operatorMap).map((val, i) =>
        renderCalculatorButton(i, val[0], val[1])
      )}
    </Flex>
  )
}
