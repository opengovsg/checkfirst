import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
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

import * as checker from '../../../types/checker'

type NumericProps = checker.Field & { order: number }

export const NumericField: FC<NumericProps> = ({
  order,
  id,
  description,
  help,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      defaultValue={0}
      rules={{ required: true }}
      render={({ ref, onChange, value }, { invalid }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel htmlFor={id}>{`${order + 1}. ${description}`}</FormLabel>
          {help && <FormHelperText mb={4}>{help}</FormHelperText>}
          <NumberInput name={id} onChange={onChange} value={value}>
            <NumberInputField ref={ref} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
