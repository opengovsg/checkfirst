import React, { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Center, Heading } from '@chakra-ui/react'
import { OtpForm, LoginForm } from '../components'

export const Login: FC = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')

  const handleLogin = () => history.push('/projects')

  return (
    <Center w="100%" h="100vh" bgColor="neutral.50">
      <Box w="lg" layerStyle="card" align="stretch">
        <Heading size="lg" mb={8}>
          Login
        </Heading>
        {!email ? (
          <OtpForm onSuccess={setEmail} />
        ) : (
          <LoginForm email={email} onLogin={handleLogin} />
        )}
      </Box>
    </Center>
  )
}
