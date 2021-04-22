import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  useStyles,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react'

import { Field } from '../../../types/checker'
import { SearchDropdown } from './SearchDropdown'

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
          <SearchDropdown
            ref={ref}
            value={value}
            onChange={onChange}
            options={options}
          />
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
