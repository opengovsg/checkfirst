import React, { FC } from 'react'
import { Stack, Text, useMultiStyleConfig } from '@chakra-ui/react'

interface LineDisplayProps {
  label: string
  value: string
}

export const LineDisplay: FC<LineDisplayProps> = ({ label, value }) => {
  const styles = useMultiStyleConfig('LineDisplay', { variant: 'base' })

  return (
    <Stack sx={styles.container} spacing="4px">
      <Text sx={styles.label}>{label}</Text>
      <Text sx={styles.value}>{value}</Text>
    </Stack>
  )
}
