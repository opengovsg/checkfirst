import React, { FC, useEffect, useState } from 'react'
import {
  BiHash,
  BiRadioCircleMarked,
  BiCheckboxChecked,
  BiPlusCircle,
  BiUpArrowAlt,
  BiDownArrowAlt,
  BiCalendar,
} from 'react-icons/bi'
import { IoIosArrowDropdown } from 'react-icons/io'
import { Center, Image, Link, Text, VStack } from '@chakra-ui/react'

import * as checker from '../../../types/checker'
import { FloatingToolbar } from './FloatingToolbar'
import {
  NumericField,
  RadioField,
  CheckboxField,
  TitleField,
  DateField,
  DropdownField,
} from '../builder/questions'

import { useCheckerContext } from '../../contexts'

import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'
import useActiveIndex from '../../hooks/use-active-index'

// Images
import emptyQuestionsTabImage from '../../assets/states/empty-questions.svg'

const TITLE_FIELD_INDEX = -1
const QUESTIONS_GUIDE_URL = 'https://go.gov.sg/checkfirst-questions'

const EmptyQuestionsTabBody: FC = () => (
  <Center py={16}>
    <VStack spacing={4} w="100%">
      <Text color="#1B3C87" textStyle="h2">
        Start building your checker
      </Text>
      <Text textAlign="center">
        Add questions to get started.{' '}
        <Link href={QUESTIONS_GUIDE_URL} isExternal color="#1B3C87">
          Learn how to work with questions
        </Link>
      </Text>
      <Image
        pt="16px"
        flex={1}
        src={emptyQuestionsTabImage}
        height={{ base: '257px', lg: 'auto' }}
        mb={{ base: '24px', lg: '0px' }}
      />
    </VStack>
  </Center>
)

const generateDefaultNumericField = (id: number): checker.Field => ({
  id: `N${id}`,
  type: 'NUMERIC',
  title: 'Insert question title',
  description: '',
  options: [],
})

const generateDefaultRadioField = (id: number): checker.Field => ({
  id: `R${id}`,
  type: 'RADIO',
  title: 'Insert question title',
  description: '',
  options: [{ label: 'Option 1', value: 0 }],
})

const generateDefaultDropdownField = (id: number): checker.Field => ({
  id: `DL${id}`,
  type: 'DROPDOWN',
  title: 'Insert question title',
  description: '',
  options: [{ label: 'Option 1', value: 0 }],
})

const generateDefaultCheckboxField = (id: number): checker.Field => ({
  id: `C${id}`,
  type: 'CHECKBOX',
  title: 'Insert question title',
  description: '',
  options: [{ label: 'Option 1', value: 0 }],
})

const generateDefaultDateField = (id: number): checker.Field => ({
  id: `D${id}`,
  type: 'DATE',
  title: 'Insert question title',
  description: '',
  options: [],
})

export const TITLE_FIELD_ID = 'TITLE'

export const QuestionsTab: FC = () => {
  const { config, dispatch } = useCheckerContext()
  const { title, description, fields } = config

  const [activeIndex, setActiveIndex] = useActiveIndex(fields)
  const [offsetTop, setOffsetTop] = useState<number>(16)
  const [nextUniqueId, setNextUniqueId] = useState<number>(1)

  useEffect(() => {
    let highestIndex = 0
    config.fields.forEach((field) => {
      const fieldIndex = parseInt((field.id.match(/\d+/) || [])[0])
      highestIndex = Math.max(highestIndex, fieldIndex)
    })
    setNextUniqueId(highestIndex + 1)
  }, [config])

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
                element: generateDefaultNumericField(nextUniqueId),
                configArrName: ConfigArrayEnum.Fields,
                newIndex: activeIndex + 1,
              },
            })
            setActiveIndex(activeIndex + 1)
            setNextUniqueId(nextUniqueId + 1)
          },
        },
        {
          label: 'Radio',
          icon: <BiRadioCircleMarked />,
          onClick: () => {
            dispatch({
              type: BuilderActionEnum.Add,
              payload: {
                element: generateDefaultRadioField(nextUniqueId),
                configArrName: ConfigArrayEnum.Fields,
                newIndex: activeIndex + 1,
              },
            })
            setActiveIndex(activeIndex + 1)
            setNextUniqueId(nextUniqueId + 1)
          },
        },
        {
          label: 'Dropdown List',
          icon: <IoIosArrowDropdown />,
          onClick: () => {
            dispatch({
              type: BuilderActionEnum.Add,
              payload: {
                element: generateDefaultDropdownField(nextUniqueId),
                configArrName: ConfigArrayEnum.Fields,
                newIndex: activeIndex + 1,
              },
            })
            setActiveIndex(activeIndex + 1)
            setNextUniqueId(nextUniqueId + 1)
          },
        },
        {
          label: 'Checkbox',
          icon: <BiCheckboxChecked />,
          onClick: () => {
            dispatch({
              type: BuilderActionEnum.Add,
              payload: {
                element: generateDefaultCheckboxField(nextUniqueId),
                configArrName: ConfigArrayEnum.Fields,
                newIndex: activeIndex + 1,
              },
            })
            setActiveIndex(activeIndex + 1)
            setNextUniqueId(nextUniqueId + 1)
          },
        },
        {
          label: 'Date',
          icon: <BiCalendar />,
          onClick: () => {
            dispatch({
              type: BuilderActionEnum.Add,
              payload: {
                element: generateDefaultDateField(nextUniqueId),
                configArrName: ConfigArrayEnum.Fields,
                newIndex: activeIndex + 1,
              },
            })
            setActiveIndex(activeIndex + 1)
            setNextUniqueId(nextUniqueId + 1)
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
      key: field.id,
      id: field.id,
      active: activeIndex === index,
      data: field,
      index,
      onActive,
      onSelect,
      setActiveIndex,
      nextUniqueId,
      setNextUniqueId,
    }

    switch (field.type) {
      case 'RADIO':
        return <RadioField {...commonProps} />
      case 'DROPDOWN':
        return <DropdownField {...commonProps} />
      case 'CHECKBOX':
        return <CheckboxField {...commonProps} />
      case 'NUMERIC':
        return <NumericField {...commonProps} />
      case 'DATE':
        return <DateField {...commonProps} />
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
        nextUniqueId={nextUniqueId}
        setNextUniqueId={setNextUniqueId}
      />
      {fields && fields.length > 0 ? (
        <>{fields.map(renderField)}</>
      ) : (
        <EmptyQuestionsTabBody />
      )}
    </VStack>
  )
}
