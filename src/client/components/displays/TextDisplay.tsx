import React, { FC } from 'react'
import { Box } from '@chakra-ui/react'

export interface TextProps {
  content: string
}

export const TextDisplay: FC<TextProps> = ({ content }) => {
  return <Box>{content}</Box>
}
