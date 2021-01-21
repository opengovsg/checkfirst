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

import { useCheckerContext } from '../../contexts'

import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'

const metadata = { title: 'Title', description: 'This is an example checker.' }

const TITLE_FIELD_INDEX = -1

const defaultNumericField: checker.Field = {
  id: 'Z',
  type: 'NUMERIC',
  description: 'Insert question description',
  help: '',
  options: [],
}

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
export const TITLE_FIELD_ID = 'TITLE'

export const QuestionsTab: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [offsetTop, setOffsetTop] = useState<number>(16)
  const { config, dispatch } = useCheckerContext()

  const toolbarOptions = [
    {
      icon: <BiPlusCircle />,
      label: 'Add question',
      menu: [
        {
          label: 'Numeric field',
          icon: <BiHash />,
          onClick: () => {
            console.log('Add numeric field')
            dispatch({
              type: BuilderActionEnum.Add,
              payload: { element: defaultNumericField, configArrName: ConfigArrayEnum.Fields, newIndex: activeIndex + 1 },
            })
          }
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
      disabled: activeIndex === TITLE_FIELD_INDEX,
    },
    {
      icon: <BiDownArrowAlt />,
      label: 'Move down',
      onClick: () => console.log('move down'),
      disabled: activeIndex === fields.length - 1,
    },
  ]

  const onSelect = ({ index }: { index: number }) => {
    setActiveIndex(index)
  }

  const onActive = ({ top }: { top: number }) => {
    setOffsetTop(top)
  }

  const renderField = (field: checker.Field, index: number) => {
    const commonProps = {
      key: field.id,
      id: field.id,
      active: activeIndex === index,
      data: field,
      index,
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
        {activeIndex && (
          <FloatingToolbar offsetTop={offsetTop} options={toolbarOptions} />
        )}
        <TitleField
          id={TITLE_FIELD_ID}
          active={activeIndex === TITLE_FIELD_INDEX}
          data={metadata}
          onSelect={onSelect}
          onActive={onActive}
          index={TITLE_FIELD_INDEX}
        />
        {fields.map(renderField)}
      </VStack>
    </Container>
  )
}
