import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox as CheckboxInput,
  CheckboxGroup,
} from '@chakra-ui/react'

import * as checker from '../../../types/checker'

type CheckboxProps = checker.Field & { order: number }

export const CheckboxField: FC<CheckboxProps> = ({
  order,
  id,
  description,
  help,
  options,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      render={({ ref, value, onChange }, { invalid }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel htmlFor={id}>{`${order + 1}. ${description}`}</FormLabel>
          {help && <FormHelperText mb={4}>{help}</FormHelperText>}
          <CheckboxGroup onChange={onChange} value={value}>
            <Stack direction="column">
              {options.map(
                (
                  { value, label }: { value: number; label: string },
                  i: number
                ) => (
                  <CheckboxInput key={i} ref={ref} name={id} value={value}>
                    {label}
                  </CheckboxInput>
                )
              )}
            </Stack>
          </CheckboxGroup>
        </FormControl>
      )}
    />
  )
}
