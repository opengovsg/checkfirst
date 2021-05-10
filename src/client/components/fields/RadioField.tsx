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
import VirtualControllerInput from './VirtualControllerInput'

export const RadioField: FC<Field> = ({ id, title, description, options }) => {
  const styles = useStyles()
  const { control } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      rules={{ required: true }}
      render={({ ref, value, onChange }, { invalid }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {title}
          </FormLabel>
          <VirtualControllerInput ref={ref} />
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
