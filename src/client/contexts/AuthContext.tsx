import { AxiosError } from 'axios'
import React, {
  FC,
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react'
import { useMutation, UseMutationResult } from 'react-query'
import { useHistory } from 'react-router-dom'

import { ApiClient } from '../api'
import { AuthService } from '../services'

interface AuthContextProps {
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const verifyOtp = useMutation<
    void,
    { message: string },
    { email: string; token: string }
  >(AuthService.verifyOtp, {
    onSuccess: () => setIsAuthenticated(true),
  })
  const auth = {
    isAuthenticated,
    verifyOtp,
  }

  const initialize = () => {
    // Setup axios interceptor to redirect to login on 401
    ApiClient.interceptors.response.use(
      (response) => response,
      (err: AxiosError) => {
        if (err.response?.status === 401) {
          // TODO: Call logout endpoint to invalidate the session
          setIsAuthenticated(false)
          history.push('/login')
        }

        return Promise.reject(err)
      }
    )

    // TODO: Attempt to fetch user object and set isAuthenticated to true if succeeds
  }

  useEffect(initialize, [])

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
