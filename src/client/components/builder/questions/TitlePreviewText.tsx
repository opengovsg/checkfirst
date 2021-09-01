import React, { FC } from 'react'
import { Text, TextProps, useMultiStyleConfig } from '@chakra-ui/react'

interface FieldIndexTextProps extends TextProps {
  index: number
}

export const TitlePreviewText: FC<FieldIndexTextProps> = ({
  index,
  children,
  ...props
}) => {
  const styles = useMultiStyleConfig('TitlePreviewText', {})

  // user-facing index starts from 1
  return (
    <Text sx={styles.title} {...props}>
      <Text as="span" sx={styles.fieldIndex}>{`${index + 1}.`}</Text> {children}
    </Text>
  )
}
