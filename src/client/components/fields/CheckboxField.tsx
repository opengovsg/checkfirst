import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  useStyles,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox as CheckboxInput,
  CheckboxGroup,
} from '@chakra-ui/react'

import { Field } from '../../../types/checker'
import VirtualControllerInput from './VirtualControllerInput'

export const CheckboxField: FC<Field> = ({
  id,
  title,
  description,
  options,
}) => {
  const styles = useStyles()
  const { control } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      defaultValue={[]}
      render={({ ref, value, onChange }, { invalid }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {title}
          </FormLabel>
          <VirtualControllerInput ref={ref} />
          {description && <FormHelperText mb={4}>{description}</FormHelperText>}
          <CheckboxGroup onChange={onChange} value={value}>
            <VStack align="stretch" spacing={4}>
              {options.map(
                (
                  { value, label }: { value: number; label: string },
                  i: number
                ) => (
                  <CheckboxInput
                    colorScheme="primary"
                    key={i}
                    ref={ref}
                    name={id}
                    value={`${value}`}
                  >
                    {label}
                  </CheckboxInput>
                )
              )}
            </VStack>
          </CheckboxGroup>
        </FormControl>
      )}
    />
  )
}
