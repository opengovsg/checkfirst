import React, { FC } from 'react'
import { Stack, Text, useMultiStyleConfig } from '@chakra-ui/react'
import xss from 'xss'

import '../../styles/inline-external-link.css'

interface LineDisplayProps {
  label: string
  value: string
}

export const LineDisplay: FC<LineDisplayProps> = ({ label, value }) => {
  const styles = useMultiStyleConfig('LineDisplay', { variant: 'base' })

  const sanitizeHtml = (html: string) => {
    const sanitizedHtml = xss(html, {
      whiteList: { a: ['class', 'target', 'rel', 'href'] },
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
    })

    return sanitizedHtml
  }

  return (
    <Stack sx={styles.container} spacing="4px">
      <Text sx={styles.label}>{label}</Text>
      <Text
        sx={styles.value}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(value),
        }}
      ></Text>
    </Stack>
  )
}
