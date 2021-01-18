import { ApiClient } from '../api'

const getOtp = async (email: string): Promise<void> => {
  await ApiClient.post<{ message: string }>('/auth', {
    email,
  })
}

const verifyOtp = async ({
  email,
  token,
}: {
  email: string
  token: string
}): Promise<void> => {
  await ApiClient.post<{ message: string }>('/auth/verify', {
    email,
    token,
  })
}

const logout = async (): Promise<void> => {
  await ApiClient.post<{ message: string }>('/auth/logout')
}

export const AuthService = {
  getOtp,
  verifyOtp,
  logout,
}
