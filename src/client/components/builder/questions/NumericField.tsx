import React from 'react'
import { BiHash } from 'react-icons/bi'
import { useStyles, Box, HStack, VStack, Text, Input } from '@chakra-ui/react'

import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const styles = useStyles()
  const { dispatch } = useCheckerContext()

  const updateQuestion = (name: string, value: string) => {
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, [name]: value },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateQuestion(name, value)
  }

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (!value) updateQuestion(name, 'Insert question title')
  }

  return (
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiHash />
      </Box>
      <VStack align="stretch" w="90%">
        <Input
          type="text"
          placeholder="Question"
          name="title"
          onBlur={handleBlur}
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
        <Input
          type="text"
          placeholder="Enter number"
          w="50%"
          sx={styles.dummyInput}
          disabled
        />
      </VStack>
    </HStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field }) => {
  const { title, description } = field
  const styles = useStyles()
  return (
    <VStack align="stretch" w="100%" spacing={6}>
      <VStack align="stretch">
        <HStack>
          <BiHash fontSize="20px" />
          <Text>{title}</Text>
        </HStack>
        {description && <Text color="#718096">{description}</Text>}
      </VStack>
      <Input
        w="50%"
        type="text"
        placeholder="Enter number"
        sx={styles.dummyInput}
        disabled
      />
    </VStack>
  )
}

export const NumericField = createBuilderField(InputComponent, PreviewComponent)
