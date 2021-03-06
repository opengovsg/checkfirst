import 'flatpickr/dist/themes/light.css'
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
  const { control } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      defaultValue={new Date()}
      rules={{ required: true }}
      render={({ onChange, value, ref }, { invalid }) => (
        <FormControl isInvalid={invalid} id={id}>
          <FormLabel sx={styles.label} htmlFor={id}>
            {title}
          </FormLabel>
          {description && <FormHelperText mb={4}>{description}</FormHelperText>}
          <Flatpickr
            onChange={([item]) => onChange(item)}
            value={value}
            ref={ref}
            options={{
              dateFormat: 'j M Y',
            }}
            render={(_, ref) => (
              <InputGroup>
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  readOnly
                  ref={ref}
                  bg="white"
                />
                <InputRightElement
                  pointerEvents="none"
                  children={<BiCalendar />}
                />
              </InputGroup>
            )}
          />
          <FormErrorMessage>Field is required</FormErrorMessage>
        </FormControl>
      )}
    />
  )
}
