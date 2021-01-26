import React, { FC, useState } from 'react'
import {
  BiHash,
  BiRadioCircleMarked,
  BiCheckboxChecked,
  BiPlusCircle,
  BiUpArrowAlt,
  BiDownArrowAlt,
} from 'react-icons/bi'
import { VStack } from '@chakra-ui/react'

import * as checker from '../../../types/checker'
import { FloatingToolbar } from './FloatingToolbar'
import {
  NumericField,
  RadioField,
  CheckboxField,
  TitleField,
} from '../builder/questions'

import { useCheckerContext } from '../../contexts'

import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'

const TITLE_FIELD_INDEX = -1

const defaultNumericField: checker.Field = {
  id: 'N',
  type: 'NUMERIC',
  description: 'Insert question description',
  help: '',
  options: [],
}

const defaultRadioField: checker.Field = {
  id: 'R',
  type: 'RADIO',
  description: 'Insert question description',
  help: '',
  options: [
    { label: 'Option 1', value: 0 },
    { label: 'Option 2', value: 1 },
  ],
}

const defaultCheckboxField: checker.Field = {
  id: 'C',
  type: 'CHECKBOX',
  description: 'Insert question description',
  help: '',
  options: [
    { label: 'Option 1', value: 0 },
    { label: 'Option 2', value: 1 },
  ],
}

export const TITLE_FIELD_ID = 'TITLE'

export const QuestionsTab: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [offsetTop, setOffsetTop] = useState<number>(16)
  const { config, dispatch } = useCheckerContext()

  const { title, description, fields } = config

  const toolbarOptions = [
    {
      icon: <BiPlusCircle />,
      label: 'Add question',
      menu: [
        {
          label: 'Numeric field',
          icon: <BiHash />,
          onClick: () => {
            dispatch({
              type: BuilderActionEnum.Add,
              payload: {
                element: defaultNumericField,
                configArrName: ConfigArrayEnum.Fields,
                newIndex: activeIndex + 1,
              },
            })
            setActiveIndex(activeIndex + 1)
          },
        },
        {
          label: 'Radio',
          icon: <BiRadioCircleMarked />,
          onClick: () => {
            dispatch({
              type: BuilderActionEnum.Add,
              payload: {
                element: defaultRadioField,
                configArrName: ConfigArrayEnum.Fields,
                newIndex: activeIndex + 1,
              },
            })
            setActiveIndex(activeIndex + 1)
          },
        },
        {
          label: 'Checkbox',
          icon: <BiCheckboxChecked />,
          onClick: () => {
            dispatch({
              type: BuilderActionEnum.Add,
              payload: {
                element: defaultCheckboxField,
                configArrName: ConfigArrayEnum.Fields,
                newIndex: activeIndex + 1,
              },
            })
            setActiveIndex(activeIndex + 1)
          },
        },
      ],
    },
    {
      icon: <BiUpArrowAlt />,
      label: 'Move up',
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Reorder,
          payload: {
            currIndex: activeIndex,
            newIndex: activeIndex - 1,
            configArrName: ConfigArrayEnum.Fields,
          },
        })
        setActiveIndex(activeIndex - 1)
      },
      disabled: activeIndex === TITLE_FIELD_INDEX || activeIndex === 0,
    },
    {
      icon: <BiDownArrowAlt />,
      label: 'Move down',
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Reorder,
          payload: {
            currIndex: activeIndex,
            newIndex: activeIndex + 1,
            configArrName: ConfigArrayEnum.Fields,
          },
        })
        setActiveIndex(activeIndex + 1)
      },
      disabled:
        activeIndex === TITLE_FIELD_INDEX || activeIndex === fields.length - 1,
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
      key: field.id + index,
      id: field.id,
      active: activeIndex === index,
      data: field,
      index,
      onActive,
      onSelect,
      setActiveIndex,
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
    <VStack align="stretch" position="relative" spacing={4}>
      <FloatingToolbar offsetTop={offsetTop} options={toolbarOptions} />
      <TitleField
        id={TITLE_FIELD_ID}
        active={activeIndex === TITLE_FIELD_INDEX}
        data={{ title, description }}
        onSelect={onSelect}
        onActive={onActive}
        index={TITLE_FIELD_INDEX}
        setActiveIndex={setActiveIndex}
      />
      {fields.map(renderField)}
    </VStack>
  )
}
