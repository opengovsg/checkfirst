import React from 'react'
import { BiListUl } from 'react-icons/bi'
import {
  VStack,
  Text,
  Input,
  Select,
  Textarea,
  useStyles,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { TitlePreviewText } from './TitlePreviewText'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const { dispatch } = useCheckerContext()
  const commonStyles = useStyles()

  const updateTitleOrDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const changeOptions = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const options = text.split('\n').map((label, value) => ({ label, value }))
    field.options = options
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, options },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiListUl />}
        />
        <Input
          type="text"
          sx={commonStyles.fieldInput}
          name="title"
          placeholder="Question"
          onChange={updateTitleOrDescription}
          value={title}
        />
      </InputGroup>
      <Input
        type="text"
        sx={commonStyles.fieldInput}
        name="description"
        placeholder="Description"
        onChange={updateTitleOrDescription}
        value={description}
      />
      <VStack sx={commonStyles.halfWidthContainer} spacing={4}>
        <Textarea
          sx={commonStyles.fieldInput}
          value={field.options.map((o) => o.label).join('\n')}
          onChange={changeOptions}
          placeholder="Enter each option on a new line"
        />
      </VStack>
    </VStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description, options } = field
  const commonStyles = useStyles()

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={3}>
      <VStack sx={commonStyles.fullWidthContainer} spacing={0}>
        <TitlePreviewText index={index}>{title}</TitlePreviewText>
        {description && (
          <Text sx={commonStyles.previewDescription}>{description}</Text>
        )}
      </VStack>
      <Select isDisabled sx={commonStyles.dummyInput}>
        {options.map(({ value, label }, i) => (
          <option key={i} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </VStack>
  )
}

export const DropdownField = createBuilderField(
  InputComponent,
  PreviewComponent
)
