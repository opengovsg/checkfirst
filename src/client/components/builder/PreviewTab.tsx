import React, { FC } from 'react'
import { Container } from '@chakra-ui/react'

import { useCheckerContext } from '../../contexts'
import { Checker } from '../../components'

export const PreviewTab: FC = () => {
  const { config } = useCheckerContext()

  return (
    <Container maxW="756px" px={0}>
      <Checker config={config} />
    </Container>
  )
}
