import React, { FC, createContext, useContext, useReducer } from 'react'
import checker from '../../types/checker'

const checkerContext = createContext<CheckerContextProps | undefined>(undefined)

export const useChecker = (): CheckerContextProps => {
  const ctx = useContext(checkerContext)
  if (!ctx) throw new Error('useChecker must be used within an CheckerProvider')
  return ctx
}

// TODO: Scaffold code. Flesh out more depending on requirements
export enum FormActionType {
  Add,
  Remove,
  Update,
}
export type CheckerAction =
  | { type: FormActionType }
  | { type: FormActionType; field: checker.Field }

export const reducer = (
  state: Partial<checker.Checker>,
  action: CheckerAction
): Partial<checker.Checker> => {
  switch (action.type) {
    case FormActionType.Add:
    case FormActionType.Update:
    case FormActionType.Remove:
    default:
      return state
  }
}

interface CheckerContextProps {
  config: Partial<checker.Checker>
  dispatch: React.Dispatch<CheckerAction>
  save: () => Promise<void>
}

export const CheckerProvider: FC = ({ children }) => {
  const [config, dispatch] = useReducer(reducer, {})

  // TODO: Call API to save config
  const save = async () => {
    console.log('save state')
  }

  // TODO: Do initial load for the checker based on id in the path

  const value = { config, dispatch, save }
  return (
    <checkerContext.Provider value={value}>{children}</checkerContext.Provider>
  )
}
