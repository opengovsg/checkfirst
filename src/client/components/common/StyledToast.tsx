import React, { FC } from 'react'
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  RenderProps,
  Spacer,
  Text,
  useMultiStyleConfig,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react'
import { BiCheckCircle, BiErrorCircle, BiX } from 'react-icons/bi'
import '../../styles/toast-width.css'

interface StyledToastProps extends RenderProps {
  message: string
  status: 'error' | 'success' | 'warning'
}

export const StyledToast: FC<StyledToastProps> = ({
  message,
  status,
  onClose,
}: StyledToastProps) => {
  const styles = useMultiStyleConfig('StyledToast', { colorScheme: status })

  const getIcon = (status: 'error' | 'success' | 'warning') => {
    if (status === 'error' || status === 'warning') return BiErrorCircle
    if (status === 'success') return BiCheckCircle
    return BiCheckCircle
  }

  return (
    <Flex role="alert" aria-live="assertive" aria-atomic="true">
      <Box sx={styles.toastBox}>
        <HStack spacing={2} sx={styles.container}>
          <Icon
            as={getIcon(status)}
            sx={styles.icon}
            title={`${status}-icon`}
          />
          <Text sx={styles.message}>{message}</Text>
          <Spacer />
          <IconButton
            icon={<BiX />}
            sx={styles.closeButton}
            aria-label="close"
            aria-hidden
            variant="link"
            onClick={onClose}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

interface useStyledToastOptions
  extends Omit<UseToastOptions, 'status' | 'description'> {
  status: 'error' | 'success' | 'warning'
  description: string
}

interface useStyledToastReturnType
  extends Omit<ReturnType<typeof useToast>, 'options'> {
  (options?: useStyledToastOptions | undefined): string | number | undefined
}

export const useStyledToast = (
  options?: useStyledToastOptions
): useStyledToastReturnType => {
  const toast = useToast({
    position: 'top',
    duration: 3000,
    ...options,
  })

  const toastImpl = (opts?: useStyledToastOptions) => {
    const status = opts?.status ?? 'success'
    const description = opts?.description ?? ''

    return toast({
      render: (props) => (
        <StyledToast status={status} message={description} {...props} />
      ),
    })
  }

  toastImpl.close = toast.close
  toastImpl.closeAll = toast.closeAll
  toastImpl.isActive = toast.isActive
  toastImpl.update = toast.update

  return toastImpl
}
