import React, { FC } from 'react'
import { useMultiStyleConfig, Box, Text } from '@chakra-ui/react'

import { Checker } from '../../../types/checker'

type CheckerCardProps = {
  onDelete: () => void
  checker: Checker
}

export const CheckerCard: FC<CheckerCardProps> = ({ checker }) => {
  const styles = useMultiStyleConfig('CheckerCard', {})
  return (
    <Box sx={styles.card}>
      <Text sx={styles.title}>{checker.title}</Text>
    </Box>
  )
}
