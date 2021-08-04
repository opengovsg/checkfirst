import React, { FC } from 'react'
import { Box } from '@chakra-ui/react'

import { useCheckerContext } from '../../contexts'
import { Checker } from '../../components'

export const PreviewTab: FC = () => {
  const { config } = useCheckerContext()

  return (
    <Box my="64px">
      <Checker config={config} />
    </Box>
  )
}
