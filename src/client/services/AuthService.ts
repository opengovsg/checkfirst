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

export const AuthService = {
  getOtp,
  verifyOtp,
}
