import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

export interface NumericProps {
  order: number
  id: string
  description: string
  help?: string
}

export const Numeric: FC<NumericProps> = ({ order, id, description, help }) => {
  const { register, errors } = useFormContext()
  const error = errors[id]

  return (
    <FormControl isInvalid={error}>
      <FormLabel htmlFor={id}>{`${order + 1}. ${description}`}</FormLabel>
      {help && <FormHelperText mb={4}>{help}</FormHelperText>}
      <NumberInput name={id}>
        <NumberInputField ref={register({ required: true })} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormErrorMessage>Field is required</FormErrorMessage>
    </FormControl>
  )
}
