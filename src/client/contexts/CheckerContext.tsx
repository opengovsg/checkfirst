import React, {
  FC,
  createContext,
  useContext,
  useReducer,
  useState,
} from 'react'
import { AxiosError } from 'axios'
import update from 'immutability-helper'
import { useRouteMatch } from 'react-router-dom'
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseMutationResult,
} from 'react-query'
import { useDisclosure, UseModalProps } from '@chakra-ui/react'

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
      const { configArrName, element, currIndex } =
        payload as BuilderUpdatePayload

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
      const { title, description } = payload as BuilderUpdateSettingsPayload

      newState = update(state, {
        title: { $set: title },
        description: { $set: description },
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
  isSaved: boolean
  setChanged: React.Dispatch<React.SetStateAction<boolean>>
  dispatch: (action: BuilderAction, callback?: () => void) => void
  save: UseMutationResult<
    Checker,
    AxiosError<{ message: string }>,
    Checker | undefined
  >
  publish: UseMutationResult<Checker, AxiosError<{ message: string }>, void>
  getUnsavedChangesModalProps: () => UseModalProps & { onDiscard?: () => void }
  checkHasChanged: (fn: () => void) => void
}

const initialConfig = {
  id: '',
  title: '',
  description: '',
  fields: [],
  operations: [],
  displays: [],
  constants: [],
  isActive: false,
  // TO-DO: add operations, displays, and constants
}

export const CheckerProvider: FC = ({ children }) => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()
  const queryClient = useQueryClient()
  const [config, dispatch] = useReducer(reducer, initialConfig)
  const [isChanged, setChanged] = useState(false)

  const unsavedChangesModal = useDisclosure()
  const [onDiscard, setOnDiscard] = useState<() => void>()

  const checkHasChanged = (fn: () => void) => {
    if (isChanged) {
      setOnDiscard(() => fn)
      return unsavedChangesModal.onOpen()
    }
    fn()
  }

  const dispatchLoad = (loadedState: Checker) => {
    dispatch({
      type: BuilderActionEnum.LoadConfig,
      payload: { loadedState },
    })
  }

  // Initial query for checker data
  const { data: savedConfig } = useQuery(
    ['builder', id],
    () => CheckerService.getChecker(id),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data) dispatchLoad(data)
      },
    }
  )

  const save = useMutation<
    Checker,
    AxiosError<{ message: string }>,
    Checker | undefined
  >((update?: Checker) => CheckerService.updateChecker(update || config), {
    onSettled: () => {
      // On success, update load the returned checker to ensure consistency with backend
      queryClient.invalidateQueries(['builder', id])
    },
  })

  const publish = useMutation<Checker, AxiosError<{ message: string }>, void>(
    () => CheckerService.publishChecker(config),
    {
      onSettled: () => {
        // On success, update load the returned checker to ensure consistency with backend
        queryClient.invalidateQueries(['builder', id])
      },
    }
  )

  const getUnsavedChangesModalProps = (): UseModalProps & {
    onDiscard?: () => void
  } => ({
    ...unsavedChangesModal,
    onDiscard,
  })

  const value = {
    config: savedConfig || config,
    isChanged,
    isSaved: JSON.stringify(config) === JSON.stringify(savedConfig),
    setChanged,
    dispatch: (action: BuilderAction, callback?: () => void) => {
      if (action.type !== BuilderActionEnum.LoadConfig) {
        const update = reducer(config, action)
        save.mutate(update, {
          onSuccess: () => {
            if (callback) callback()
          },
        })
      } else {
        dispatch(action)
        if (callback) callback()
      }
    },
    save,
    publish,
    getUnsavedChangesModalProps,
    checkHasChanged,
  }

  return (
    <checkerContext.Provider value={value}>{children}</checkerContext.Provider>
  )
}
