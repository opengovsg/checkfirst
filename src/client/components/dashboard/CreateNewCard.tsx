import React, { FC } from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { BiPlus } from 'react-icons/bi'
import { useMultiStyleConfig, Text, VStack } from '@chakra-ui/react'

export const CreateNewCard: FC = () => {
  const { path } = useRouteMatch()
  const styles = useMultiStyleConfig('CheckerCard', { variant: 'create' })

  return (
    <>
      <Link to={{ pathname: `${path}/create` }}>
        <VStack sx={styles.card} spacing="26px">
          <BiPlus size="50px" style={{ display: 'inline' }} />
          <Text mt="16px" sx={styles.title}>
            Create new
            <br />
            checker
          </Text>
        </VStack>
      </Link>
    </>
  )
}
