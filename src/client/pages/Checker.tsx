import React, { FC } from 'react'
import { Flex } from '@chakra-ui/react'

import * as checker from '../../types/checker'
import { Checker as CheckerComponent } from '../components'

const EXAMPLE: checker.Checker = {
  id: 'checker-test',
  title: 'Computation of Foreign Workers Quota for Services Sector',
  description: '(From 1 Jan 2021)',
  fields: [
    {
      id: 'IN_0',
      type: 'NUMERIC',
      description: 'Number of local employees',
      help:
        'Local employees are Singapore citizens or PRs earning at least the Local Qualifying Salary (LQS).',
      options: [],
    },
    {
      id: 'IN_1',
      type: 'NUMERIC',
      description: 'Number of S Pass holders',
      help:
        'The S Pass holder sub quota is 10% of your total (local + foreign) workforce',
      options: [],
    },
  ],
  operations: [
    {
      id: 'OUT_0',
      type: 'ARITHMETIC',
      expression: 'max(30 - IN_0, 0)',
    },
    {
      id: 'OUT_1',
      type: 'ARITHMETIC',
      expression: 'max(40 - IN_1 - OUT_0, 0)',
    },
    {
      id: 'OUT_2',
      type: 'ARITHMETIC',
      expression: 'ifelse(OUT_1 <= 0, "Eligible", "Ineligible")',
    },
  ],
  constants: [
    { id: 'CONST_0', value: 'Total number of foreign workers' },
    { id: 'CONST_1', value: 'Number of S Pass workers you can hire' },
    { id: 'CONST_2', value: 'Eligible for special exemption' },
  ],
  displays: [
    {
      id: 'DISP_0',
      type: 'LINE',
      targets: ['CONST_0', 'OUT_0'],
    },
    {
      id: 'DISP_1',
      type: 'LINE',
      targets: ['CONST_1', 'OUT_1'],
    },
    {
      id: 'DISP_1',
      type: 'LINE',
      targets: ['CONST_2', 'OUT_2'],
    },
  ],
}

export const Checker: FC = () => {
  return (
    <Flex direction="column" bg="neutral.50" minH="100vh">
      <CheckerComponent config={EXAMPLE} />
    </Flex>
  )
}
