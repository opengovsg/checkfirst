import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import {
  useStyles,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react'

import 'react-datepicker/dist/react-datepicker.css'
import '../../styles/date-picker.css'

import { Field } from '../../../types/checker'

export const DateField: FC<Field> = ({ id, title, description }) => {
  const styles = useStyles()
  const { control, errors } = useFormContext()
  const error = errors[id]

  return (
    <Controller
      name={id}
      control={control}
      render={({ onChange, value }, { invalid }) => (
        <FormControl isInvalid={invalid} id={id}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {title}
          </FormLabel>
          {description && <FormHelperText mb={4}>{description}</FormHelperText>}
          <DatePicker
            wrapperClassName={error ? 'fieldError' : ''}
            selected={value}
            onChange={onChange}
            showPopperArrow={true}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
