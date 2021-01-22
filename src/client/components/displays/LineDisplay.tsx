import React, { FC } from 'react'
import { HStack, Text } from '@chakra-ui/react'

interface LineDisplayProps {
  label: string
  value: string
}

export const LineDisplay: FC<LineDisplayProps> = ({ label, value }) => {
  return (
    <HStack justifyContent="space-between">
      <Text flex={1}>{label}</Text>
      <Text fontWeight="bold">{value}</Text>
    </HStack>
  )
}
