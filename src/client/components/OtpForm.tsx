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
      <VStack spacing="32px" align="stretch">
        <FormControl id="email" isInvalid={hasError()}>
          <FormLabel label="#11263C">Login</FormLabel>
          <Text color="#6D7580" mb="24px">
            Only available for use by public officers with a{' '}
            <strong>gov.sg</strong> email.
          </Text>
          <Input
            h="48px"
            bg="#F4F6F9"
            type="email"
            name="email"
            ref={register({ required: true })}
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
