import React from 'react'
import { BiListCheck, BiX } from 'react-icons/bi'
import {
  Button,
  IconButton,
  Box,
  HStack,
  VStack,
  Text,
  Input,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react'

import * as checker from '../../../../types/checker'
import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title } = field
  const { dispatch } = useCheckerContext()

  const updateQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, title: value },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const deleteOption = (option: checker.FieldOption, i: number) => {
    field.options.splice(i, 1)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, options: field.options },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const updateOption = (
    option: checker.FieldOption,
    update: Partial<checker.FieldOption>,
    i: number
  ) => {
    const updatedOption = { ...option, ...update }
    field.options.splice(i, 1, updatedOption)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, options: field.options },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const addOption = () => {
    const newOptionLabel = `Option ${field.options.length + 1}`
    // newValue is an increment of the last option's value to ensure that values are unique
    const newValue = field.options[field.options.length - 1].value + 1
    const newOption = { label: newOptionLabel, value: newValue }
    field.options.push(newOption)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, options: field.options },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const renderOption = (option: checker.FieldOption, i: number) => {
    return (
      <HStack key={i}>
        <Checkbox isChecked={false} />
        <Input
          type="text"
          value={option.label}
          onChange={(e) => {
            updateOption(option, { label: e.target.value }, i)
          }}
        />
        <IconButton
          aria-label="Delete option"
          fontSize="20px"
          icon={<BiX />}
          onClick={() => deleteOption(option, i)}
        />
      </HStack>
    )
  }

  return (
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiListCheck />
      </Box>
      <VStack align="stretch" w="50%" spacing={6}>
        <Input
          type="text"
          placeholder="Question"
          onChange={updateQuestion}
          value={title}
        />
        <VStack spacing={4} alignItems="left">
          {field.options.map(renderOption)}
          <HStack h={10}>
            <Checkbox isChecked={false} />
            <Box pl={2}>
              <Button variant="link" onClick={addOption}>
                Add new option
              </Button>
            </Box>
          </HStack>
        </VStack>
      </VStack>
    </HStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field }) => {
  const { title, options } = field
  return (
    <VStack align="stretch" w="50%" spacing={4}>
      <HStack>
        <BiListCheck fontSize="20px" />
        <Text>{title}</Text>
      </HStack>
      <CheckboxGroup>
        <VStack alignItems="left" spacing={2}>
          {options.map(({ value, label }, i) => (
            <Checkbox key={i} value={value} isChecked={false}>
              {label}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </VStack>
  )
}

export const CheckboxField = createBuilderField(
  InputComponent,
  PreviewComponent
)
