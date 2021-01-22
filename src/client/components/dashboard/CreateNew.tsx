import React, { FC } from 'react'
import { BiPlus } from 'react-icons/bi'
import { useMultiStyleConfig, useDisclosure, Text, Box } from '@chakra-ui/react'
import { CreateNewModal } from './CreateNewModal'

export type CreateNewProps = {
  onSuccess: () => void
}

export const CreateNew: FC<CreateNewProps> = ({ onSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const styles = useMultiStyleConfig('CheckerCard', { variant: 'create' })

  return (
    <>
      <Box onClick={onOpen} sx={styles.card}>
        <BiPlus size="50px" style={{ display: 'inline', marginTop: '36px' }} />
        <Text mt="16px" sx={styles.title}>
          Create New
        </Text>
      </Box>
      <CreateNewModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />
    </>
  )
}
