import React, { FC } from 'react'
import { Container } from '@chakra-ui/react'

import { useCheckerContext } from '../../contexts'
import { Checker } from '../../components'

export const PreviewTab: FC = () => {
  const { config } = useCheckerContext()

  return (
    <Container
      mt="64px"
      mb="64px"
      maxW="xl"
      pt="32px"
      px="0px"
      bg="white"
      borderRadius="12px"
    >
      <Checker config={config} />
    </Container>
  )
}
