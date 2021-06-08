import React, { FC } from 'react'
import { Text, TextProps, useStyleConfig } from '@chakra-ui/react'

interface FieldIndexTextProps extends TextProps {
  index: number
}

export const FieldIndexText: FC<FieldIndexTextProps> = ({ index }) => {
  const style = useStyleConfig('FieldIndexText', {})

  return (
    <Text sx={style}>{`${index + 1}.`}</Text> // user-facing index starts from 1
  )
}
