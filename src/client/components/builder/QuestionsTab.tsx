import React, { FC, useState } from 'react'
import {
  BiHash,
  BiRadioCircleMarked,
  BiCheckboxChecked,
  BiPlusCircle,
  BiUpArrowAlt,
  BiDownArrowAlt,
} from 'react-icons/bi'
import { Container, VStack } from '@chakra-ui/react'

import * as checker from '../../../types/checker'
import {
  FloatingToolbar,
  NumericField,
  RadioField,
  CheckboxField,
  TitleField,
} from '../builder'

const metadata = { title: 'Title', description: 'This is an example checker.' }
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
    options: [{ label: 'Option 1' }, { label: 'Option 2' }],
  },
  {
    id: 'D',
    type: 'RADIO',
    description: 'Question 4',
    help: '',
    options: [{ label: 'Option 1' }, { label: 'Option 2' }],
  },
  {
    id: 'E',
    type: 'CHECKBOX',
    description: 'Question 5',
    help: '',
    options: [{ label: 'Option 1' }, { label: 'Option 2' }],
  },
  {
    id: 'F',
    type: 'CHECKBOX',
    description: 'Question 6',
    help: '',
    options: [{ label: 'Option 1' }, { label: 'Option 2' }],
  },
]
export const TITLE_FIELD_ID = 'TITLE'

export const QuestionsTab: FC = () => {
  const [activeId, setActiveId] = useState<string>(fields[0].id)
  const [offsetTop, setOffsetTop] = useState<number>(16)

  const toolbarOptions = [
    {
      icon: <BiPlusCircle />,
      label: 'Add question',
      menu: [
        {
          label: 'Numeric field',
          icon: <BiHash />,
          onClick: () => console.log('Add numeric field'),
        },
        {
          label: 'Radio',
          icon: <BiRadioCircleMarked />,
          onClick: () => console.log('Add radio field'),
        },
        {
          label: 'Checkbox',
          icon: <BiCheckboxChecked />,
          onClick: () => console.log('Add checkbox field'),
        },
      ],
    },
    {
      icon: <BiUpArrowAlt />,
      label: 'Move up',
      onClick: () => console.log('move up'),
      disabled: activeId === TITLE_FIELD_ID || activeId === fields[0].id,
    },
    {
      icon: <BiDownArrowAlt />,
      label: 'Move down',
      onClick: () => console.log('move down'),
      disabled: activeId === fields[fields.length - 1].id,
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
      id: field.id,
      active: activeId === field.id,
      data: field,
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
    <Container maxW="756px" px={0}>
      <VStack align="stretch" position="relative" spacing={4}>
        {activeId && (
          <FloatingToolbar offsetTop={offsetTop} options={toolbarOptions} />
        )}
        <TitleField
          id={TITLE_FIELD_ID}
          active={activeId === TITLE_FIELD_ID}
          data={metadata}
          onSelect={onSelect}
          onActive={onActive}
        />
        {fields.map(renderField)}
      </VStack>
    </Container>
  )
}
