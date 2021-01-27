import React from 'react'
import { BiCalculator } from 'react-icons/bi'
import { VStack, HStack, Box, Text, Input } from '@chakra-ui/react'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'

const InputComponent: OperationFieldComponent = ({ operation, index }) => {
  const { title, expression } = operation
  const { dispatch } = useCheckerContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...operation, [name]: value },
        configArrName: ConfigArrayEnum.Operations,
      },
    })
  }

  return (
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiCalculator />
      </Box>
      <VStack align="stretch" w="100%">
        <Input
          name="title"
          type="text"
          placeholder="Operation title"
          onChange={handleChange}
          value={title}
        />
        <Input
          name="expression"
          type="text"
          placeholder="Enter expression"
          bg="#F4F6F9"
          fontFamily="mono"
          value={expression}
          onChange={handleChange}
        />
      </VStack>
    </HStack>
  )
}

const PreviewComponent: OperationFieldComponent = ({ operation }) => {
  const { title, expression } = operation
  return (
    <VStack align="stretch" w="50%" spacing={4}>
      <HStack>
        <BiCalculator fontSize="20px" />
        <Text>{title}</Text>
      </HStack>
      <Text fontFamily="mono">{expression}</Text>
    </VStack>
  )
}

export const CalculatedResult = createBuilderField(
  InputComponent,
  PreviewComponent
)
