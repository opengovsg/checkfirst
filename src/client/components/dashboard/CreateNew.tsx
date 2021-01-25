import React, { FC } from 'react'
import { useHistory, useRouteMatch, Route, Link } from 'react-router-dom'
import { BiPlus } from 'react-icons/bi'
import { useMultiStyleConfig, Text, VStack } from '@chakra-ui/react'
import { CreateNewModal } from './CreateNewModal'

export const CreateNew: FC = () => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const styles = useMultiStyleConfig('CheckerCard', { variant: 'create' })

  return (
    <>
      <Link to={{ pathname: `${path}/create` }}>
        <VStack sx={styles.card}>
          <BiPlus size="50px" style={{ display: 'inline' }} />
          <Text mt="16px" sx={styles.title}>
            Create New
          </Text>
        </VStack>
      </Link>
      <Route
        path={`${path}/create`}
        exact
        render={() => (
          <CreateNewModal isOpen onClose={() => history.push(path)} />
        )}
      />
    </>
  )
}
