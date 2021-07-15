import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  useStyles,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox as CheckboxInput,
  CheckboxGroup,
  Box,
} from '@chakra-ui/react'

import { Field } from '../../../types/checker'

import '../../styles/checker-field.css'

export const CheckboxField: FC<Field> = ({
  id,
  title,
  description,
  options,
}) => {
  const styles = useStyles()
  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext()

  return (
    <Controller
      name={id}
      control={control}
      defaultValue={[]}
      render={({
        field: { ref, value, onChange },
        fieldState: { invalid },
      }) => (
        <Box className="checker-field">
          <FormControl isInvalid={invalid}>
            <FormLabel sx={styles.label} htmlFor={id}>
              {title}
            </FormLabel>
            {description && (
              <FormHelperText mb={4}>{description}</FormHelperText>
            )}
            <CheckboxGroup onChange={onChange} value={value}>
              <VStack align="stretch" spacing={4}>
                {options.map(
                  (
                    { value, label }: { value: number; label: string },
                    i: number
                  ) => (
                    <CheckboxInput
                      colorScheme="primary"
                      key={i}
                      ref={ref}
                      name={id}
                      value={`${value}`}
                      isDisabled={isSubmitSuccessful}
                    >
                      {label}
                    </CheckboxInput>
                  )
                )}
              </VStack>
            </CheckboxGroup>
          </FormControl>
        </Box>
      )}
    />
  )
}
