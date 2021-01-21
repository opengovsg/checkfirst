import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Radio as RadioInput,
  RadioGroup,
} from '@chakra-ui/react'

import * as checker from '../../../types/checker'

type RadioProps = checker.Field & { order: number }

export const RadioField: FC<RadioProps> = ({
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
      rules={{ required: true }}
      defaultValue={options[0]?.value}
      render={({ ref, value, onChange }, { invalid }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel htmlFor={id}>{`${order + 1}. ${description}`}</FormLabel>
          {help && <FormHelperText mb={4}>{help}</FormHelperText>}
          <RadioGroup name={id} value={value} onChange={onChange}>
            <Stack direction="column">
              {options.map(({ value }: { value: string }, i: number) => (
                <RadioInput key={i} ref={ref} name={id} value={value}>
                  {value}
                </RadioInput>
              ))}
            </Stack>
          </RadioGroup>
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
