import React, { FC } from 'react'
import { Container, Box } from '@chakra-ui/react'

import * as checker from '../../types/checker'
import { Checker as CheckerComponent } from '../components'

const EXAMPLE: checker.Checker = {
  id: 'checker-test',
  title: 'Simple a*b',
  fields: [
    {
      id: 'IN_0',
      type: 'NUMERIC',
      description: 'Define a',
      help: '',
      options: [],
    },
    {
      id: 'IN_1',
      type: 'NUMERIC',
      description: 'Define b',
      help: '',
      options: [],
    },
    {
      id: 'IN_2',
      type: 'RADIO',
      description: 'Define b',
      help: '',
      options: [{ label: 'Option 1', value: 0 }, { label: 'Option 2', value: 1 }],
    },
  ],
  operations: [
    {
      id: 'OUT_0',
      type: 'ARITHMETIC',
      expression: 'IN_0 * IN_1',
    },
    {
      id: 'OUT_1',
      type: 'ARITHMETIC',
      expression: 'OUT_0 + 2 * CONST_2',
    },
  ],
  constants: [
    {
      id: 'CONST_0',
      value: 'Thanks for completing the quiz! Your result is:',
    },
    {
      id: 'CONST_1',
      value: 'https://www.google.com',
    },
    {
      id: 'CONST_2',
      value: '5',
    },
  ],
  displays: [
    {
      id: 'DISP_0',
      type: 'TEXT',
      targets: ['CONST_0'],
    },
    {
      id: 'DISP_1',
      type: 'TEXT',
      targets: ['OUT_0'],
    },
    {
      id: 'DISP_2',
      type: 'BUTTON',
      targets: ['OUT_1', 'CONST_1'],
    },
  ],
}

export const Checker: FC = () => {
  return (
    <Box bgColor="neutral.50" minH="100vh">
      <Container maxW="756px">
        <CheckerComponent config={EXAMPLE} />
      </Container>
    </Box>
  )
}
