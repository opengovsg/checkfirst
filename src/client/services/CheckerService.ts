import { ApiClient } from '../api'

import * as checker from '../../types/checker'

const getChecker = async (id: string): Promise<checker.Checker> => {
  return ApiClient.get(`/c/drafts/${id}`).then((res) => res.data)
}

const listCheckers = async (): Promise<checker.Checker[]> => {
  return ApiClient.get(`/c/drafts`).then((res) => res.data)
}

const updateChecker = async (
  checker: checker.Checker
): Promise<checker.Checker> => {
  return ApiClient.put<checker.Checker>(
    `/c/drafts/${checker.id}`,
    checker
  ).then((res) => res.data)
}

const deleteChecker = async (id: string): Promise<void> => {
  return ApiClient.delete(`/c/drafts/${id}`)
}

const createChecker = async (
  checker: checker.Checker
): Promise<checker.Checker> => {
  return ApiClient.post<checker.Checker>(`/c/drafts`, checker).then(
    (res) => res.data
  )
}

const getPublishedChecker = async (id: string): Promise<checker.Checker> => {
  return ApiClient.get(`/c/${id}`).then((res) => res.data)
}

const publishChecker = async (
  checker: checker.Checker
): Promise<checker.Checker> => {
  return ApiClient.post(`/c/drafts/${checker.id}/publish`, checker).then(
    (res) => res.data
  )
}

export const CheckerService = {
  getChecker,
  listCheckers,
  updateChecker,
  deleteChecker,
  createChecker,
  getPublishedChecker,
  publishChecker,
}
