import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  useStyles,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Radio as RadioInput,
  RadioGroup,
} from '@chakra-ui/react'

import { Field } from '../../../types/checker'

export const RadioField: FC<Field> = ({ id, title, description, options }) => {
  const styles = useStyles()
  const { control } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      rules={{ required: true }}
      defaultValue={`${options[0]?.value}`}
      render={({ ref, value, onChange }, { invalid }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {title}
          </FormLabel>
          {description && <FormHelperText mb={4}>{description}</FormHelperText>}
          <RadioGroup name={id} value={value} onChange={onChange}>
            <VStack align="stretch" spacing={4}>
              {options.map(
                (
                  { value, label }: { value: number; label: string },
                  i: number
                ) => (
                  <RadioInput
                    colorScheme="primary"
                    key={i}
                    ref={ref}
                    name={id}
                    value={`${value}`}
                  >
                    {label}
                  </RadioInput>
                )
              )}
            </VStack>
          </RadioGroup>
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
