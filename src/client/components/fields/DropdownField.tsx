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
import { Combobox } from '../common/Combobox'

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
      defaultValue={''}
      // combobox controls its own value independently of the controller
      render={({ field: { ref, onChange }, fieldState: { invalid } }) => (
        <FormControl isInvalid={invalid}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {title}
          </FormLabel>
          {description && <FormHelperText mb={4}>{description}</FormHelperText>}
          <Combobox
            style={{ scrollMarginTop: '88px' }}
            label={title}
            onChange={onChange}
            items={options.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            dropdownOptions={{
              height: 224,
              itemHeight: 48,
              inset: 8,
            }}
            inputOptions={{
              forwardRef: ref,
              useClearButton: true,
            }}
          />
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
