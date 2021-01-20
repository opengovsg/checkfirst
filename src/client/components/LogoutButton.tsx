import React, { FC } from 'react'
import { BiLogOutCircle } from 'react-icons/bi'
import { Button } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../contexts'

export const LogoutButton: FC = () => {
  const auth = useAuth()
  const history = useHistory()

  const logout = async () => {
    await auth.logout()
    history.push('/')
  }

  return (
    <Button onClick={logout} variant="ghost" rightIcon={<BiLogOutCircle />}>
      Sign Out
    </Button>
  )
}
