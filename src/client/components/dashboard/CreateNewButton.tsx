import React, { FC } from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { BiPlus } from 'react-icons/bi'
import { Button } from '@chakra-ui/react'

export const CreateNewButton: FC = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <Link to={{ pathname: `${path}/create` }}>
        <Button
          leftIcon={<BiPlus />}
          colorScheme="primary"
          width="100%"
          type="submit"
        >
          Create new checker
        </Button>
      </Link>
    </>
  )
}
