import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import {
  useStyles,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'

import 'react-datepicker/dist/react-datepicker.css'
import '../../styles/date-picker.css'

import { Field } from '../../../types/checker'
import { BiCalendar } from 'react-icons/bi'

interface DatePickerInputProps {
  value: string
  onClick: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}

const DatePickerInput: FC<DatePickerInputProps> = ({ value, onClick }) => (
  <InputGroup>
    <Input
      type="text"
      placeholder="DD/MM/YYYY"
      className="react-datepicker-ignore-onclickoutside"
      value={value}
      onClick={onClick}
      readOnly
    />
    <InputRightElement pointerEvents="none" children={<BiCalendar />} />
  </InputGroup>
)

export const DateField: FC<Field> = ({ id, title, description }) => {
  const styles = useStyles()
  const { control, errors } = useFormContext()
  const error = errors[id]

  return (
    <Controller
      name={id}
      control={control}
      rules={{ required: true }}
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
            showPopperArrow={false}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="DD/MM/YYYY"
            dateFormat="dd MMM yyyy"
            customInput={React.createElement(DatePickerInput)}
          />
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
