import { ApiClient } from '../api'

import * as checker from '../../types/checker'

const getChecker = async (id: string): Promise<checker.Checker> => {
  return ApiClient.get(`/c/${id}`).then((res) => res.data)
}

const updateChecker = async (
  checker: checker.Checker
): Promise<checker.Checker> => {
  return ApiClient.put<checker.Checker>(`/c/${checker.id}`, checker).then(
    (res) => res.data
  )
}

const deleteChecker = async (id: string): Promise<void> => {
  return ApiClient.delete(`/c/${id}`)
}

const createChecker = async (
  checker: checker.Checker
): Promise<checker.Checker> => {
  return ApiClient.post<checker.Checker>(`/c`, checker).then((res) => res.data)
}

export const CheckerService = {
  getChecker,
  updateChecker,
  deleteChecker,
  createChecker,
}
