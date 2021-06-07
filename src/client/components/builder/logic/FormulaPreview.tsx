import React, { FC } from 'react'
import { IconType } from 'react-icons'
import { VStack, HStack, Text, useStyles } from '@chakra-ui/react'

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
  const commonStyles = useStyles()

  return (
    <VStack
      sx={commonStyles.fullWidthContainer}
      spacing={4}
      opacity={show ? 1 : 0.5}
    >
      <HStack>
        <Icon fontSize="16px" />
        <Text sx={commonStyles.previewTitle}>{title}</Text>
      </HStack>
      <Text sx={commonStyles.expressionInput}>{expression}</Text>
    </VStack>
  )
}
