import React, { FC } from 'react'
import { Stack, Text, useMultiStyleConfig } from '@chakra-ui/react'

import { sanitizeHtml } from '../../utils/sanitize-html'
import '../../styles/inline-external-link.css'

interface LineDisplayProps {
  label: string
  value: string
}

export const LineDisplay: FC<LineDisplayProps> = ({ label, value }) => {
  const styles = useMultiStyleConfig('LineDisplay', { variant: 'base' })

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
