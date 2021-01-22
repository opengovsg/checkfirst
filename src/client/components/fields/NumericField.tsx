import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  useStyles,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'

import { Field } from '../../../types/checker'

export const NumericField: FC<Field> = ({ id, description, help }) => {
  const styles = useStyles()
  const { control } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      defaultValue={0}
      rules={{ required: true }}
      render={({ ref, onChange, value }, { invalid }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {description}
          </FormLabel>
          {help && <FormHelperText mb={4}>{help}</FormHelperText>}
          <NumberInput
            sx={styles.input}
            name={id}
            onChange={onChange}
            value={value}
          >
            <NumberInputField ref={ref} />
          </NumberInput>
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
