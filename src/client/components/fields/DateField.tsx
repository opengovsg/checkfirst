import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import {
  useStyles,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react'

import 'react-datepicker/dist/react-datepicker.css'
import '../../styles/date-picker.css'

import { Field } from '../../../types/checker'

export const DateField: FC<Field> = ({ id, description, help }) => {
  const styles = useStyles()
  const { register, errors } = useFormContext()
  const [date, setDate] = useState(new Date())
  const error = errors[id]

  const changeHandler = (newDate: Date) => {
    if (newDate) setDate(newDate)
  }

  return (
    <FormControl isInvalid={error} id={id}>
      <FormLabel sx={styles.label} htmlFor={id}>
        {description}
      </FormLabel>
      {help && <FormHelperText mb={4}>{help}</FormHelperText>}
      <Input
        type="hidden"
        name={id}
        value={date ? date.valueOf() : undefined}
        ref={register({ required: true })}
      />
      <DatePicker
        wrapperClassName={error ? 'fieldError' : ''}
        value={date ? date.toISOString().split('T')[0] : ''}
        selected={date}
        onChange={changeHandler}
        showPopperArrow={true}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
      <FormErrorMessage>Field is required</FormErrorMessage>
    </FormControl>
  )
}
