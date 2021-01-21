import React from 'react'
import { BiText } from 'react-icons/bi'
import { Box, HStack, VStack, Text, Input, Heading } from '@chakra-ui/react'

import { createQuestionField, TitleFieldComponent } from './QuestionField'

const InputComponent: TitleFieldComponent = ({ title, description, index }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const update = { [name]: value }

    // TODO: Dispatch value to save new title and description
    console.log(`dispatch value`, update)
  }

  return (
    <HStack w="100%" alignItems="flex-start" mb={4}>
      <Box fontSize="20px" pt={2}>
        <BiText />
      </Box>
      <VStack align="stretch" w="100%">
        <Input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={title}
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={description}
        />
      </VStack>
    </HStack>
  )
}

const PreviewComponent: TitleFieldComponent = ({ title, description, index }) => {
  return (
    <VStack align="stretch" w="100%">
      <Heading>{title}</Heading>
      <Text>{description}</Text>
    </VStack>
  )
}

export const TitleField = createQuestionField(InputComponent, PreviewComponent)
