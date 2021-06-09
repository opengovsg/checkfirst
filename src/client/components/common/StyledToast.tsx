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
} from '@chakra-ui/react'
import { BiCheckCircle, BiErrorCircle, BiX } from 'react-icons/bi'

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
    <Flex
      sx={styles.boxContainer}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
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

export const useStyledToast = () => {
  const toast = useToast({
    position: 'top',
    duration: 6000,
  })

  return toast
}
