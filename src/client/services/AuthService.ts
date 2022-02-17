import { ApiClient } from '../api'

const getOtp = async (email: string): Promise<void> => {
  await ApiClient.post<{ email: string }, void>('/auth', {
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
  await ApiClient.post<{ email: string; token: string }, void>('/auth/verify', {
    email,
    token,
  })
}

const logout = async (): Promise<void> => {
  await ApiClient.post<never, void>('/auth/logout')
}

export const AuthService = {
  getOtp,
  verifyOtp,
  logout,
}
