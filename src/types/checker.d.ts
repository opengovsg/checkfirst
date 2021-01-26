import { User } from './user'

export interface Checker {
  id: string
  title: string
  description?: string
  users?: User[]

  fields: Field[]
  constants: Constant[]
  operations: Operation[]
  displays: Display[]
}

export type ConfigArrayName = 'fields' | 'operations' | 'displays' | 'constants'

export interface Field {
  id: string
  type: FieldType
  description: string
  help: string
  options: FieldOption[]
}

export interface FieldOption {
  label: string
  value: number
}

export type FieldType = 'NUMERIC' | 'RADIO' | 'CHECKBOX' | 'SLIDER' | 'DATE'

export interface Display {
  id: string
  type: DisplayType
  targets: string[]
}

export type DisplayType = 'TEXT' | 'BUTTON' | 'LINE'

export interface Operation {
  id: string
  type: OperationType
  description: string
  expression: string
  show: boolean
}

export type OperationType = 'ARITHMETIC' | 'IFELSE' | 'SWITCH'

export interface Constant {
  id: string
  value: string
}
