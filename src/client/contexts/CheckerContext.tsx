import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { AxiosError } from 'axios'
import update from 'immutability-helper'
import { useRouteMatch } from 'react-router-dom'
import { useQuery, useMutation, UseMutationResult } from 'react-query'

import { Checker } from '../../types/checker'
import {
  BuilderAction,
  BuilderAddPayload,
  BuilderUpdatePayload,
  BuilderRemovePayload,
  BuilderReorderPayload,
  BuilderUpdateSettingsPayload,
  BuilderLoadConfigPayload,
} from '../../types/builder'
import { BuilderActionEnum } from '../../util/enums'
import { CheckerService } from '../services'

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

    case BuilderActionEnum.LoadConfig: {
      const { loadedState } = payload as BuilderLoadConfigPayload
      return loadedState
    }

    default:
      return state
  }
}

interface CheckerContextProps {
  config: Checker
  isChanged: boolean
  dispatch: React.Dispatch<BuilderAction>
  save: UseMutationResult<Checker, AxiosError<{ message: string }>, void>
}

const initialConfig = {
  id: '',
  title: '',
  description: '',
  fields: [],
  operations: [],
  displays: [],
  constants: [],
  // TO-DO: add operations, displays, and constants
}

export const CheckerProvider: FC = ({ children }) => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()
  const [config, dispatch] = useReducer(reducer, initialConfig)
  const [lastSavedConfig, setLastSavedConfig] = useState<Checker>(initialConfig)
  const [isChanged, setChanged] = useState(false)

  const dispatchLoad = (loadedState: Checker) => {
    dispatch({
      type: BuilderActionEnum.LoadConfig,
      payload: { loadedState },
    })
    setLastSavedConfig(loadedState)
  }

  // Initial query for checker data
  const { isSuccess, data } = useQuery(['builder', id], () =>
    CheckerService.getChecker(id)
  )
  useEffect(() => {
    if (data) {
      dispatchLoad(data)
    }
  }, [isSuccess, data])

  useEffect(() => {
    setChanged(JSON.stringify(config) !== JSON.stringify(lastSavedConfig))
  }, [config, lastSavedConfig])

  const save = useMutation<Checker, AxiosError<{ message: string }>, void>(
    () => CheckerService.updateChecker(config),
    {
      onSuccess: (checker) => {
        // On success, update load the returned checker to ensure consistency with backend
        dispatchLoad(checker)
      },
    }
  )

  const value = { config, isChanged, dispatch, save }
  return (
    <checkerContext.Provider value={value}>{children}</checkerContext.Provider>
  )
}
