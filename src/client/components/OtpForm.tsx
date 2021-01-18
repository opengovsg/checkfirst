import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import {
  Box,
  Button,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from '@chakra-ui/react'

import { getApiErrorMessage } from '../api'
import { AuthService } from '../services'

interface OtpFormProps {
  onSuccess: (email: string) => void
}

export const OtpForm: FC<OtpFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, errors } = useForm()
  const sendOtp = useMutation(AuthService.getOtp, {
    onSuccess: (_, email) => onSuccess(email),
  })

  const onSubmit = (data: { email: string }) => {
    sendOtp.reset()
    const { email } = data
    sendOtp.mutate(email)
  }

  const hasError = () => errors.email || sendOtp.isError

  const getErrorMessage = (): string => {
    const { email } = errors
    return email && email.type === 'required'
      ? 'Please provide a valid email address'
      : getApiErrorMessage(sendOtp.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align="stretch">
        <FormControl id="email" isInvalid={hasError()}>
          <FormLabel>Email address</FormLabel>
          <Input type="email" name="email" ref={register({ required: true })} />
          {hasError() ? (
            <FormErrorMessage>{getErrorMessage()}</FormErrorMessage>
          ) : (
            <FormHelperText>
              Please use your @agency.gov.sg email
            </FormHelperText>
          )}
        </FormControl>
        <Box textAlign="right">
          <Button
            isLoading={sendOtp.isLoading}
            colorScheme="primary"
            type="submit"
          >
            Get OTP
          </Button>
        </Box>
      </VStack>
    </form>
  )
}
