import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  Input,
} from '@chakra-ui/react'

const PHONE_REGEX = '^(6|8|9)[0-9]{7}$'
const EMAIL_REGEX = '^([a-zA-Z0-9_-.]+)@([a-zA-Z0-9-]+.)+[a-zA-Z]{2,4}$'

export interface TextProps {
  order: number
  id: string
  textType?: string
  description: string
  help?: string
}

export const Text: FC<TextProps> = ({
  order,
  id,
  textType,
  description,
  help,
}) => {
  const { register, errors } = useFormContext()
  const error = errors[id]

  const checkFieldRegex = (textInput: string) => {
    let regexTest
    switch (textType) {
      case 'PHONE':
        regexTest = RegExp(PHONE_REGEX)
        break
      case 'EMAIL':
        regexTest = RegExp(EMAIL_REGEX)
        break
      default:
        return true
    }
    return regexTest.test(textInput)
  }

  const generateErrorMessage = () => {
    if (!errors[id]) return ''
    switch (errors[id].type) {
      case 'required':
        return `Field is required`
      case 'validate':
        return `Field does not match format`
    }
  }

  return (
    <FormControl isInvalid={error}>
      <FormLabel htmlFor={id}>{`${order + 1}. ${description}`}</FormLabel>
      {help && <FormHelperText mb={4}>{help}</FormHelperText>}
      <InputGroup>
        <Input
          name={id}
          ref={register({ required: true, validate: checkFieldRegex })}
        />
      </InputGroup>
      <FormErrorMessage>{generateErrorMessage()}</FormErrorMessage>
    </FormControl>
  )
}
