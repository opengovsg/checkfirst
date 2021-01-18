import React, { FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import {
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from '@chakra-ui/react'

import { getApiErrorMessage } from '../api'
import { AuthService } from '../services'
import { useAuth } from '../contexts'

const RESEND_WAIT_TIME = 30000 // 30 seconds

interface LoginFormProps {
  email: string
  onLogin: () => void
}

export const LoginForm: FC<LoginFormProps> = ({ email, onLogin }) => {
  const auth = useAuth()
  const [canResend, setCanResend] = useState(false)
  const [resendTimer, setResendTimer] = useState(RESEND_WAIT_TIME / 1000)
  const { register, handleSubmit, errors } = useForm()
  const sendOtp = useMutation(AuthService.getOtp, {
    onSuccess: () => {
      setResendTimer(RESEND_WAIT_TIME / 1000)
      setCanResend(false)
    },
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let interval: NodeJS.Timeout

    if (!canResend) {
      interval = setInterval(() => {
        setResendTimer((t) => Math.max(t - 1, 0))
      }, 1000)

      timeout = setTimeout(() => {
        setCanResend(true)
        clearInterval(interval)
      }, RESEND_WAIT_TIME)
    }

    return () => {
      timeout && clearTimeout(timeout)
      interval && clearInterval(interval)
    }
  }, [canResend])

  const onSubmit = (data: { token: string }) => {
    auth.verifyOtp.reset()
    const { token } = data
    auth.verifyOtp.mutate(
      { email, token },
      {
        onSuccess: onLogin,
      }
    )
  }

  const hasError = () => errors.email || auth.verifyOtp.isError

  const getErrorMessage = (): string => {
    const { otp } = errors
    return otp && otp.type === 'required'
      ? 'Please provide a valid OTP'
      : getApiErrorMessage(auth.verifyOtp.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align="stretch">
        <FormControl id="email" isInvalid={hasError()}>
          <FormLabel>One time password</FormLabel>
          <Input type="text" name="token" ref={register({ required: true })} />
          {hasError() ? (
            <FormErrorMessage>{getErrorMessage()}</FormErrorMessage>
          ) : (
            <FormHelperText>
              Please enter the OTP sent to {email}.
            </FormHelperText>
          )}
        </FormControl>
        <HStack justifyContent="flex-end" spacing={6}>
          <Button
            variant="link"
            disabled={!canResend}
            onClick={() => sendOtp.mutate(email)}
          >
            {canResend ? 'Resend' : `Resend in ${resendTimer}s`}
          </Button>
          <Button
            isLoading={auth.verifyOtp.isLoading}
            colorScheme="primary"
            type="submit"
          >
            Login
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}
