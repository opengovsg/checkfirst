import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  useStyles,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react'

import { Field } from '../../../types/checker'

export const DropdownField: FC<Field> = ({
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
      rules={{ required: true }}
      defaultValue={`${options[0]?.value}`}
      render={({ ref, value, onChange }, { invalid }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {title}
          </FormLabel>
          {description && <FormHelperText mb={4}>{description}</FormHelperText>}
          <Select name={id} value={value} onChange={onChange}>
            {options.map(
              (
                { value, label }: { value: number; label: string },
                i: number
              ) => (
                <option key={i} ref={ref} value={`${value}`}>
                  {label}
                </option>
              )
            )}
          </Select>
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
