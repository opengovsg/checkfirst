import React, { FC } from 'react'
import { IconType } from 'react-icons'
import { VStack, HStack, Text } from '@chakra-ui/react'

interface FormulaPreviewProps {
  show: boolean
  title: string
  expression: string
  icon: IconType
}

export const FormulaPreview: FC<FormulaPreviewProps> = ({
  show,
  title,
  expression,
  icon: Icon,
}) => {
  return (
    <VStack align="stretch" w="50%" spacing={4} opacity={show ? 1 : 0.5}>
      <HStack>
        <Icon fontSize="20px" />
        <Text>{title}</Text>
      </HStack>
      <Text fontFamily="mono">{expression}</Text>
    </VStack>
  )
}
