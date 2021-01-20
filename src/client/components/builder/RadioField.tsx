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
import { createQuestionField, QuestionFieldComponent } from './QuestionField'

const InputComponent: QuestionFieldComponent = ({ field }) => {
  const { description } = field

  // TODO: Complete following functions by calling appropriate dispatch

  const updateQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    console.log('update question', value)
  }

  const deleteOption = (option: checker.FieldOption) => {
    console.log('delete option', option)
  }

  const updateOption = (
    option: checker.FieldOption,
    update: Partial<checker.FieldOption>
  ) => {
    const newOption = { ...option, ...update }
    console.log('update option', newOption)
  }

  const addOption = () => {
    console.log('add new option')
  }

  const renderOption = (option: checker.FieldOption, i: number) => {
    return (
      <HStack key={i}>
        <Radio isChecked={false} />
        <Input
          type="text"
          value={option.label}
          onChange={(e) => {
            updateOption(option, { label: e.target.value })
          }}
        />
        <IconButton
          aria-label="Delete option"
          fontSize="20px"
          icon={<BiX />}
          onClick={() => deleteOption(option)}
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
          {options.map(({ label, value }, i) => (
            <Radio key={i} value={value} isChecked={false}>
              {label}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </VStack>
  )
}

export const RadioField = createQuestionField(InputComponent, PreviewComponent)
