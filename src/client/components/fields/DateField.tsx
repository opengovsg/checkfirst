import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react'

import 'react-datepicker/dist/react-datepicker.css'
import '../../styles/date-picker.css'

import * as checker from '../../../types/checker'

type DateProps = checker.Field & { order: number }

export const DateField: FC<DateProps> = ({ order, id, description, help }) => {
  const { register, errors } = useFormContext()
  const [date, setDate] = useState(new Date())
  const error = errors[id]

  const changeHandler = (newDate: Date) => {
    if (newDate) setDate(newDate)
  }

  return (
    <FormControl isInvalid={error} id={id}>
      <FormLabel htmlFor={id}>{`${order + 1}. ${description}`}</FormLabel>
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
