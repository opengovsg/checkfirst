import axios from 'axios'

const API_BASE_URL = '/api/v1'

export const getApiErrorMessage = (error: unknown): string => {
  const defaultErrMsg = 'Something went wrong'
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data.message ??
      error.response?.statusText ??
      defaultErrMsg
    )
  }

  if (error instanceof Error) {
    return error.message ?? defaultErrMsg
  }

  return defaultErrMsg
}

export const ApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000, // 100 secs
})
