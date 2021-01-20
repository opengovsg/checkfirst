import React from 'react'
import { BiHash } from 'react-icons/bi'
import { useStyles, Box, HStack, VStack, Text, Input } from '@chakra-ui/react'

import { createQuestionField, QuestionFieldComponent } from './QuestionField'

const InputComponent: QuestionFieldComponent = () => {
  const styles = useStyles()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // TODO: Dispatch value to save new question
    console.log(`dispatch value ${value}`)
  }

  return (
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiHash />
      </Box>
      <VStack align="stretch" w="50%">
        <Input type="text" placeholder="Question" onChange={handleChange} />
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

const PreviewComponent: QuestionFieldComponent = () => {
  const styles = useStyles()
  return (
    <VStack align="stretch" w="50%">
      <HStack>
        <BiHash fontSize="20px" />
        <Text>Question</Text>
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
