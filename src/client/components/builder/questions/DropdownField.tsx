import React from 'react'
import { BiListUl } from 'react-icons/bi'
import {
  Box,
  HStack,
  VStack,
  Text,
  Input,
  Select,
  Textarea,
  useStyles,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const { dispatch } = useCheckerContext()

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
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiListUl />
      </Box>
      <VStack align="stretch" w="90%" spacing={6}>
        <VStack align="stretch" spacing={2}>
          <Input
            type="text"
            name="title"
            placeholder="Question"
            onChange={updateTitleOrDescription}
            value={title}
          />
          <Input
            type="text"
            name="description"
            placeholder="Description"
            onChange={updateTitleOrDescription}
            value={description}
          />
        </VStack>
        <VStack spacing={4} alignItems="left" w="50%">
          <Textarea
            value={field.options.map((o) => o.label).join('\n')}
            onChange={changeOptions}
            placeholder="Enter each option on a new line"
          />
        </VStack>
      </VStack>
    </HStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field }) => {
  const { title, description, options } = field
  const styles = useStyles()
  return (
    <VStack align="stretch" w="100%" spacing={6}>
      <VStack align="stretch">
        <HStack>
          <BiListUl fontSize="20px" />
          <Text>{title}</Text>
        </HStack>
        {description && <Text color="#718096">{description}</Text>}
      </VStack>
      <Select isDisabled sx={styles.dummyInput}>
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
