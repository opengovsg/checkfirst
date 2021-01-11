export interface Config {
  id: string
  title: string
  description?: string

  fields: Field[]
  results: Result[]
  transforms: Transform[]
}

export interface Field {
  id: string
  type: FieldType
  order: number
  description: string
  options: FieldOption[]
}

export interface FieldOption {
  label: string
  value: number
}

export type FieldType = 'NUMERIC' | 'RADIO' | 'CHECKBOX' | 'SLIDER' | 'DATE'

export interface Result {
  id: number
  order: number
  type: ResultType
  formula: string
}

export type ResultType = 'TEXT' | 'NUMERIC'

export interface Transform {
  id: string
  type: TransformType
  targets: string[]
  arguments: (string | number)[]
}

export type TransformType =
  | SingleFieldTransform
  | MultiFieldTransform
  | LogicalTransform

export type SingleFieldTransform = 'EQUALS' | 'GT' | 'LT' | 'GTE' | 'LTE'

export type MultiFieldTransform =
  | 'SUM'
  | 'SUM'
  | 'MEAN'
  | 'MEDIAN'
  | 'MULTIPLY'
  | 'DIVIDE'
  | 'ADD'
  | 'SUBTRACT'

export type LogicalTransform = 'IF' | 'THEN' | 'AND' | 'OR' | 'NOT'
