import React, { FC, createContext, useContext, useReducer } from 'react'
import update from 'immutability-helper'
import { Checker } from '../../types/checker'
import {
  BuilderAction,
  BuilderAddPayload,
  BuilderUpdatePayload,
  BuilderRemovePayload,
  BuilderReorderPayload,
  BuilderUpdateSettingsPayload,
} from '../../types/builder'

import { BuilderActionEnum } from '../../util/enums'

const checkerContext = createContext<CheckerContextProps | undefined>(undefined)

export const useCheckerContext = (): CheckerContextProps => {
  const ctx = useContext(checkerContext)
  if (!ctx) throw new Error('useChecker must be used within an CheckerProvider')
  return ctx
}

export const reducer = (state: Checker, action: BuilderAction): Checker => {
  const { type, payload } = action
  let newState: Checker

  switch (type) {
    case BuilderActionEnum.Add: {
      const { configArrName, element, newIndex } = payload as BuilderAddPayload
      newState = update(state, {
        [configArrName]: {
          $splice: [[newIndex, 0, element]],
        },
      })
      return newState
    }

    case BuilderActionEnum.Update: {
      const {
        configArrName,
        element,
        currIndex,
      } = payload as BuilderUpdatePayload

      newState = update(state, {
        [configArrName]: {
          $splice: [[currIndex, 1, element]],
        },
      })
      return newState
    }

    case BuilderActionEnum.Remove: {
      const { configArrName, currIndex } = payload as BuilderRemovePayload

      newState = update(state, {
        [configArrName]: {
          $splice: [[currIndex, 1]],
        },
      })
      return newState
    }

    case BuilderActionEnum.Reorder: {
      const reorderPayload = payload as BuilderReorderPayload

      // needs a currIndex, newIndex
      const { currIndex, newIndex, configArrName } = reorderPayload
      const field = state[configArrName][currIndex]

      newState = update(state, {
        [configArrName]: {
          $splice: [
            [currIndex, 1],
            [newIndex, 0, field],
          ],
        },
      })
      return newState
    }

    case BuilderActionEnum.UpdateSettings: {
      const { settingsName, value } = payload as BuilderUpdateSettingsPayload

      newState = update(state, {
        [settingsName]: {
          $set: value,
        },
      })

      return newState
    }

    default:
      return state
  }
}

interface CheckerContextProps {
  config: Checker
  dispatch: React.Dispatch<BuilderAction>
  save: () => Promise<void>
}

const initialConfig = {
  id: '1', // uuid() or existing id from DB
  title: 'Checker Title',
  description: 'My description',
  fields: [],
  operations: [],
  displays: [],
  constants: [],
  // TO-DO: add operations, displays, and constants
}

export const CheckerProvider: FC = ({ children }) => {
  const [config, dispatch] = useReducer(reducer, initialConfig)

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
