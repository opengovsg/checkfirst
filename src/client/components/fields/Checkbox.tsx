import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox as CheckboxInput,
  CheckboxGroup,
} from '@chakra-ui/react'

interface CheckboxOption {
  label: string
  value: number
}

export interface CheckboxProps {
  order: number
  id: string
  description: string
  help?: string
  options: CheckboxOption[]
}

export const Checkbox: FC<CheckboxProps> = ({
  order,
  id,
  description,
  help,
  options,
}) => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <FormLabel htmlFor={id}>{`${order + 1}. ${description}`}</FormLabel>
      {help && <FormHelperText mb={4}>{help}</FormHelperText>}
      <CheckboxGroup>
        <Stack direction="column">
          {options.map(({ label }: { label: string }, i: number) => (
            <CheckboxInput ref={register} key={i} name={id} value={`${i}`}>
              {label}
            </CheckboxInput>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  )
}
