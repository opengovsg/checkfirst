import React from 'react'
import { BiListUl, BiX } from 'react-icons/bi'
import {
  Button,
  IconButton,
  Box,
  HStack,
  VStack,
  Text,
  Input,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'

import * as checker from '../../../types/checker'
import { useCheckerContext } from '../../contexts'
import { createBuilderField, QuestionFieldComponent } from './BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { description } = field
  const { dispatch } = useCheckerContext()

  const updateQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, description: value },
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
        <Radio isChecked={false} />
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
        <BiListUl />
      </Box>
      <VStack align="stretch" w="50%" spacing={6}>
        <Input
          type="text"
          placeholder="Question"
          onChange={updateQuestion}
          value={description}
        />
        <VStack spacing={4} alignItems="left">
          {field.options.map(renderOption)}
          <HStack h={10}>
            <Radio isChecked={false} />
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
  const { description, options } = field
  return (
    <VStack align="stretch" w="50%" spacing={4}>
      <HStack>
        <BiListUl fontSize="20px" />
        <Text>{description}</Text>
      </HStack>
      <RadioGroup>
        <VStack alignItems="left" spacing={2}>
          {options.map(({ value, label }, i) => (
            <Radio key={i} value={value} isChecked={false}>
              {label}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </VStack>
  )
}

export const RadioField = createBuilderField(InputComponent, PreviewComponent)
