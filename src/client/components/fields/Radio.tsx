import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Radio as RadioInput,
  RadioGroup,
} from '@chakra-ui/react'

interface RadioOption {
  label: string
  value: number
}

export interface RadioProps {
  order: number
  id: string
  description: string
  help?: string
  options: RadioOption[]
}

export const Radio: FC<RadioProps> = ({
  order,
  id,
  description,
  help,
  options,
}) => {
  const { register, errors } = useFormContext()
  const error = errors[id]

  return (
    <FormControl isInvalid={error}>
      <FormLabel htmlFor={id}>{`${order + 1}. ${description}`}</FormLabel>
      {help && <FormHelperText mb={4}>{help}</FormHelperText>}
      <RadioGroup name={id} defaultValue="0">
        <Stack direction="column">
          {options.map(({ label }: { label: string }, i: number) => (
            <RadioInput
              ref={register({ required: true })}
              key={i}
              id={`${i}`}
              value={`${i}`}
            >
              {label}
            </RadioInput>
          ))}
        </Stack>
      </RadioGroup>
      <FormErrorMessage>Field is required</FormErrorMessage>
    </FormControl>
  )
}
