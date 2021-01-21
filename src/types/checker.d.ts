export interface Checker {
  id: string
  title: string
  description?: string

  fields: Field[]
  constants: Constant[]
  operations: Operation[]
  displays: Display[]
}

export interface Field {
  id: string
  type: FieldType
  description: string
  help: string
  options: FieldOption[]
}

export interface FieldOption {
  value: string
}

export type FieldType = 'NUMERIC' | 'RADIO' | 'CHECKBOX' | 'SLIDER' | 'DATE'

export interface Display {
  id: string
  type: DisplayType
  targets: string[]
}

export type DisplayType = 'TEXT' | 'BUTTON'

export interface Operation {
  id: string
  type: OperationType
  expression: string
}

export type OperationType = 'ARITHMETIC' | 'IFELSE' | 'SWITCH'

export interface Constant {
  id: string
  value: string
}
