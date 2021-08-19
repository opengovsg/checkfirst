import {
  Field,
  Operation,
  Display,
  Constant,
  ConfigArrayName,
  Checker,
} from './checker'

export type BuilderActionType =
  | 'ADD'
  | 'REMOVE'
  | 'UPDATE'
  | 'REORDER'
  | 'UPDATE_SETTINGS'
  | 'LOAD_CONFIG'

export type BuilderAddPayload = (
  | FieldPayload
  | OperationPayload
  | DisplayPayload
  | ConstantPayload
) & {
  newIndex: number
}

export type BuilderUpdatePayload = (
  | FieldPayload
  | OperationPayload
  | DisplayPayload
  | ConstantPayload
) & {
  currIndex: number
}

export interface FieldPayload {
  configArrName: 'fields'
  element: Field
}

export interface OperationPayload {
  configArrName: 'operations'
  element: Operation
}

export interface DisplayPayload {
  configArrName: 'displays'
  element: Display
}

export interface ConstantPayload {
  configArrName: 'constants'
  element: Constant
}

export interface BuilderRemovePayload {
  currIndex: number
  configArrName: ConfigArrayName
}

export interface BuilderReorderPayload {
  currIndex: number
  newIndex: number
  configArrName: ConfigArrayName
}

export interface BuilderUpdateSettingsPayload {
  title: string
  description?: string
}

export interface BuilderLoadConfigPayload {
  loadedState: Checker
}

export interface BuilderAction {
  type: BuilderActionType
  payload:
    | BuilderAddPayload
    | BuilderUpdatePayload
    | BuilderRemovePayload
    | BuilderReorderPayload
    | BuilderUpdateSettingsPayload
    | BuilderLoadConfigPayload
}
