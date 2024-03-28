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
  Input,
  Text,
} from '@chakra-ui/react'

import { getApiErrorMessage } from '../api'
import { AuthService } from '../services'

interface OtpFormProps {
  onSuccess: (email: string) => void
}

export const OtpForm: FC<OtpFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const sendOtp = useMutation(AuthService.getOtp, {
    onSuccess: (_, email) => onSuccess(email),
  })

  const onSubmit = (data: { email: string }) => {
    sendOtp.reset()
    const { email } = data

    // format email to database expectations
    const formattedEmail = email.toLowerCase()

    sendOtp.mutate(formattedEmail)
  }

  const hasError = (): boolean => !!errors.email || sendOtp.isError

  const getErrorMessage = (): string => {
    return errors && errors.email
      ? 'Please provide a valid .gov.sg email address'
      : getApiErrorMessage(sendOtp.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="32px" align="stretch">
        <FormControl id="email" isInvalid={hasError()}>
          <FormLabel label="neutral.900">Login</FormLabel>
          <Text color="neutral.700" mb="24px">
            Only available for use by public officers with a{' '}
            <strong>.gov.sg</strong> email.
          </Text>
          <Input
            h="48px"
            {...register('email', {
              required: true,
              pattern:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+.gov.sg$/,
            })}
            placeholder="e.g. jane@open.gov.sg"
          />
          {hasError() && (
            <FormErrorMessage>{getErrorMessage()}</FormErrorMessage>
          )}
        </FormControl>
        <Box>
          <Button
            size="lg"
            isLoading={sendOtp.isLoading}
            colorScheme="primary"
            type="submit"
          >
            Get started
          </Button>
        </Box>
      </VStack>
    </form>
  )
}
