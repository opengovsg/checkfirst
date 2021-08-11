import { Box, Flex, FlexProps, Text, Icon, Divider } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { BiLink, BiParagraph } from 'react-icons/bi'
import { ImQuotesLeft } from 'react-icons/im'
import React, { FC } from 'react'

const OPERATOR_MAP: Array<{ icon: string; value: string }> = [
  { icon: '@', value: '@' },
  { icon: '+', value: '+' },
  { icon: '×', value: '*' },
  { icon: '÷', value: '/' },
  { icon: '(', value: '(' },
  { icon: ')', value: ')' },
  { icon: '^', value: '^' },
  { icon: '%', value: '%' },
  { icon: '>', value: '>' },
  { icon: '≥', value: '>=' },
  { icon: '<', value: '<' },
  { icon: '≤', value: '<=' },
  { icon: '=', value: '==' },
  { icon: '≠', value: '!=' },
]

const FUNCTION_MAP: Array<{ icon: IconType; value: string }> = [
  {
    icon: ImQuotesLeft,
    value: '"Type in text for results"',
  },
  {
    icon: BiParagraph,
    value: 'paragraph("Type content")',
  },
  {
    icon: BiLink,
    value: 'link("Type link display name", "https://example.com")',
  },
]

interface CalculatorBarProps extends Omit<FlexProps, 'onClick'> {
  onClick: (character: string) => void
}

export const CalculatorBar: FC<CalculatorBarProps> = ({
  onClick,
  ...props
}) => {
  const renderCalculatorButton = (
    index: number,
    operator: string | IconType,
    mappedOperator: string
  ) => {
    const renderIcon = () => {
      if (typeof operator === 'string') return operator

      const OperatorIcon = operator
      return <Icon as={OperatorIcon} />
    }

    return (
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
          {renderIcon()}
        </Text>
      </Box>
    )
  }

  return (
    <Flex {...props}>
      {OPERATOR_MAP.map(({ icon, value }, i) =>
        renderCalculatorButton(i, icon, value)
      )}
      <Box py="4px">
        <Divider orientation="vertical" borderColor="#DADCE3" />
      </Box>
      {FUNCTION_MAP.map(({ icon, value }, i) =>
        renderCalculatorButton(i, icon, value)
      )}
    </Flex>
  )
}
