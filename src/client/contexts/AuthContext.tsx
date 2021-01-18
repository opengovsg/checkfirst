import { AxiosError } from 'axios'
import React, { FC, createContext, useEffect, useContext } from 'react'
import { useMutation, UseMutationResult } from 'react-query'
import { useHistory } from 'react-router-dom'

import { User } from '../../types/user'

import { ApiClient } from '../api'
import useLocalStorage from '../hooks/use-local-storage'
import { AuthService } from '../services'

interface AuthContextProps {
  logout: () => void
  isAuthenticated: boolean
  verifyOtp: UseMutationResult<
    void,
    { message: string },
    { email: string; token: string }
  >
}

const authContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuth = (): AuthContextProps => {
  const auth = useContext(authContext)
  if (!auth) throw new Error('useAuth must be used within an AuthProvider')
  return auth
}

export const AuthProvider: FC = ({ children }) => {
  const history = useHistory()
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage(
    'isAuthenticated',
    false
  )
  const verifyOtp = useMutation<
    void,
    { message: string },
    { email: string; token: string }
  >(AuthService.verifyOtp, {
    onSuccess: () => setIsAuthenticated(true),
  })

  const logout = async () => {
    await ApiClient.post('/auth/logout')
    setIsAuthenticated(false)
  }

  const auth = {
    logout,
    isAuthenticated,
    verifyOtp,
  }

  const initialize = () => {
    // Setup axios interceptor to redirect to login on 401
    ApiClient.interceptors.response.use(
      (response) => response,
      async (err: AxiosError) => {
        if (err.response?.status === 401) {
          await logout()
          history.push('/login')
        }

        return Promise.reject(err)
      }
    )

    // Attempt to fetch user object and set isAuthenticated to true if succeeds
    ApiClient.get<User | null>('/auth/whoami').then((user) => {
      if (user.data) {
        setIsAuthenticated(true)
      }
    })
  }

  useEffect(initialize, [])

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
