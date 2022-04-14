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
  Input,
  Text,
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
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

  const hasError = (): boolean => !!errors.token || auth.verifyOtp.isError

  const getErrorMessage = (): string => {
    return errors && errors.token
      ? 'Please provide a valid OTP'
      : auth.verifyOtp.isError
      ? getApiErrorMessage(auth.verifyOtp.error)
      : ''
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="32px" align="stretch">
        <FormControl id="token" isInvalid={hasError()}>
          <FormLabel color="neutral.900" isRequired>
            One time password
          </FormLabel>
          <Text color="neutral.700" mb="24px">
            Please enter the OTP sent to {email}.
          </Text>
          <Input
            h="48px"
            {...register('token', {
              required: true,
              minLength: 6,
              maxLength: 6,
              pattern: /^\d{6}/,
            })}
            autoComplete="one-time-code"
            placeholder="e.g. 111111"
          />
          <FormErrorMessage children={getErrorMessage()} />
        </FormControl>
        <HStack justifyContent="flex-start" spacing={6}>
          <Button
            size="lg"
            isLoading={auth.verifyOtp.isLoading}
            colorScheme="primary"
            type="submit"
          >
            Login
          </Button>
          <Button
            variant="link"
            disabled={!canResend}
            onClick={() => sendOtp.mutate(email)}
          >
            {canResend ? 'Resend' : `Resend in ${resendTimer}s`}
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}
