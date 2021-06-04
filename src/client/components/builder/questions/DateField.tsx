import React from 'react'
import { BiCalendar } from 'react-icons/bi'
import {
  useStyles,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
} from '@chakra-ui/react'

import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { FieldIndexText } from './FieldIndexText'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const commonStyles = useStyles()

  const { dispatch } = useCheckerContext()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, [name]: value },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiCalendar />}
        />
        <Input
          type="text"
          sx={commonStyles.fieldInput}
          placeholder="Question"
          name="title"
          onChange={handleChange}
          value={title}
        />
      </InputGroup>
      <Input
        type="text"
        sx={commonStyles.fieldInput}
        name="description"
        placeholder="Description"
        onChange={handleChange}
        value={description}
      />
      <InputGroup sx={commonStyles.halfWidthContainer}>
        <Input
          type="text"
          placeholder="DD/MM/YYYY"
          sx={commonStyles.dummyInput}
          disabled
        />
        <InputRightElement
          pointerEvents="none"
          children={<BiCalendar opacity={0.7} />}
        />
      </InputGroup>
    </VStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const commonStyles = useStyles()

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={3}>
      <VStack sx={commonStyles.fullWidthContainer} spacing={0}>
        <HStack>
          <FieldIndexText index={index} />
          <Text sx={commonStyles.previewTitle}>{title}</Text>
        </HStack>
        {description && (
          <Text sx={commonStyles.previewDescription}>{description}</Text>
        )}
      </VStack>
      <InputGroup sx={commonStyles.halfWidthContainer}>
        <Input
          type="text"
          placeholder="DD/MM/YYYY"
          sx={commonStyles.dummyInput}
          disabled
        />
        <InputRightElement
          pointerEvents="none"
          children={<BiCalendar opacity={0.7} />}
        />
      </InputGroup>
    </VStack>
  )
}

export const DateField = createBuilderField(InputComponent, PreviewComponent)
