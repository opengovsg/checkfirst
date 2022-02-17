import 'flatpickr/dist/themes/light.css'
import moment from 'moment'
import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
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

import '../../styles/date-picker.css'

import { Field } from '../../../types/checker'
import { BiCalendar } from 'react-icons/bi'

export const DateField: FC<Field> = ({ id, title, description }) => {
  const styles = useStyles()
  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      defaultValue={new Date(new Date().setHours(0, 0, 0, 0))}
      rules={{ required: true }}
      render={({
        field: { onChange, value, ref },
        fieldState: { invalid },
      }) => (
        <FormControl isInvalid={invalid} id={id}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {title}
          </FormLabel>
          {description && <FormHelperText mb={4}>{description}</FormHelperText>}
          <Flatpickr
            onChange={([item]) => onChange(item)}
            value={value}
            ref={(reactFlatpickr) => {
              ref(reactFlatpickr?.flatpickr.input)
            }}
            render={({ value }, ref) => {
              const formattedDate = moment(
                value as Date | string | number
              ).format('D MMM YYYY')

              return (
                <InputGroup>
                  <Input
                    type="text"
                    value={formattedDate}
                    placeholder="DD/MM/YYYY"
                    readOnly
                    ref={ref}
                    style={{ scrollMarginTop: '88px' }}
                    bg="white"
                    isDisabled={isSubmitSuccessful}
                  />
                  <InputRightElement
                    pointerEvents="none"
                    children={<BiCalendar />}
                    color={isSubmitSuccessful ? '#A5ABB3' : 'black'}
                  />
                </InputGroup>
              )
            }}
          />
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
