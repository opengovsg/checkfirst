import React from 'react'
import { BiHash } from 'react-icons/bi'
import { useStyles, Box, HStack, VStack, Text, Input } from '@chakra-ui/react'

import { createQuestionField, QuestionFieldComponent } from './QuestionField'
import { useCheckerContext } from '../../contexts'

import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { description } = field
  const styles = useStyles()
  const { dispatch } = useCheckerContext()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiHash />
      </Box>
      <VStack align="stretch" w="50%">
        <Input
          type="text"
          placeholder="Question"
          onChange={handleChange}
          value={description}
        />
        <Input
          type="text"
          placeholder="Enter number"
          sx={styles.dummyInput}
          disabled
        />
      </VStack>
    </HStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field }) => {
  const { description } = field
  const styles = useStyles()
  return (
    <VStack align="stretch" w="50%">
      <HStack>
        <BiHash fontSize="20px" />
        <Text>{description}</Text>
      </HStack>
      <Input
        type="text"
        placeholder="Enter number"
        sx={styles.dummyInput}
        disabled
      />
    </VStack>
  )
}

export const NumericField = createQuestionField(
  InputComponent,
  PreviewComponent
)
