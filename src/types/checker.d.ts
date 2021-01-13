export interface Checker {
  id: string
  title: string
  description?: string

  fields: Field[]
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
  label: string
  value: number
}

export type FieldType = 'NUMERIC' | 'RADIO' | 'CHECKBOX' | 'SLIDER' | 'DATE'

export interface Display {
  id: string
  type: DisplayType
  target: string
}

export type DisplayType = 'TEXT' | 'NUMERIC'

export interface Operation {
  id: string
  type: OperationType
  expression: string
}

export type OperationType = 'ARITHMETIC' | 'IFELSE' | 'SWITCH'
