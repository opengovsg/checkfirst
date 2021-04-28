import React, { FC } from 'react'
import { Stack, Text, useMultiStyleConfig } from '@chakra-ui/react'

// If the value is over this threshold, the result will be rendered as horizontal
// regardless of whether it is in mobile view.
const OVERFLOW_LENGTH = 25

interface LineDisplayProps {
  label: string
  value: string
}

export const LineDisplay: FC<LineDisplayProps> = ({ label, value }) => {
  const isOverflow = value.length > OVERFLOW_LENGTH
  const styles = useMultiStyleConfig('LineDisplay', {
    variant: isOverflow ? 'column' : 'base',
  })

  return (
    <Stack sx={styles.container} spacing="8px">
      <Text sx={styles.label}>{label}</Text>
      <Text sx={styles.value}>{value}</Text>
    </Stack>
  )
}
