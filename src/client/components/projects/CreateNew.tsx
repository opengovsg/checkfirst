import React, { FC } from 'react'
import { BiPlus } from 'react-icons/bi'
import { useStyleConfig, Text, Box } from '@chakra-ui/react'

export const CreateNew: FC = () => {
  const styles = useStyleConfig('CheckerCard', {})
  return (
    <Box sx={styles} bg="primary.500" color="white">
      <BiPlus size="50px" style={{ display: 'inline', marginTop: '36px' }} />
      <Text mt="16px" fontSize="16px" fontWeight="600">
        Create New
      </Text>
    </Box>
  )
}
