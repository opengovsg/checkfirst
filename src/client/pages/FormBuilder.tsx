import React, { FC, useState } from 'react'
import { BiPlusCircle, BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi'
import { Container, Flex, VStack } from '@chakra-ui/react'

import * as checker from '../../types/checker'
import {
  FloatingToolbar,
  Navbar,
  NumericField,
  RadioField,
  CheckboxField,
} from '../components/builder'

const fields: checker.Field[] = [
  {
    id: 'A',
    type: 'NUMERIC',
    description: 'Question 1',
    help: '',
    options: [],
  },
  {
    id: 'B',
    type: 'NUMERIC',
    description: 'Question 2',
    help: '',
    options: [],
  },
  {
    id: 'C',
    type: 'RADIO',
    description: 'Question 3',
    help: '',
    options: [
      { label: 'Option 1', value: 0 },
      { label: 'Option 2', value: 1 },
    ],
  },
  {
    id: 'D',
    type: 'RADIO',
    description: 'Question 4',
    help: '',
    options: [
      { label: 'Option 1', value: 0 },
      { label: 'Option 2', value: 1 },
    ],
  },
  {
    id: 'E',
    type: 'CHECKBOX',
    description: 'Question 5',
    help: '',
    options: [
      { label: 'Option 1', value: 0 },
      { label: 'Option 2', value: 1 },
    ],
  },
  {
    id: 'F',
    type: 'CHECKBOX',
    description: 'Question 6',
    help: '',
    options: [
      { label: 'Option 1', value: 0 },
      { label: 'Option 2', value: 1 },
    ],
  },
]

export const FormBuilder: FC = () => {
  const [activeId, setActiveId] = useState<string>(fields[0].id)
  const [offsetTop, setOffsetTop] = useState<number>(48)

  const toolbarOptions = [
    {
      icon: <BiPlusCircle />,
      label: 'Add question',
      onClick: () => console.log('clicked'),
    },
    {
      icon: <BiUpArrowAlt />,
      label: 'Move up',
      onClick: () => console.log('move up'),
    },
    {
      icon: <BiDownArrowAlt />,
      label: 'Move down',
      onClick: () => console.log('move down'),
    },
  ]

  const onSelect = ({ id }: { id: string }) => {
    setActiveId(id)
  }

  const onActive = ({ top }: { top: number }) => {
    setOffsetTop(top)
  }

  const renderField = (field: checker.Field) => {
    const commonProps = {
      key: field.id,
      active: activeId === field.id,
      field,
      onActive,
      onSelect,
    }

    switch (field.type) {
      case 'RADIO':
        return <RadioField {...commonProps} />
      case 'CHECKBOX':
        return <CheckboxField {...commonProps} />
      case 'NUMERIC':
        return <NumericField {...commonProps} />
    }
  }

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar />
      <Container maxW="756px" pt="80px" px={0}>
        <VStack align="stretch" py="40px" position="relative">
          {activeId && (
            <FloatingToolbar offsetTop={offsetTop} options={toolbarOptions} />
          )}
          {fields.map(renderField)}
        </VStack>
      </Container>
    </Flex>
  )
}
