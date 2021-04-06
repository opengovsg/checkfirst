import { Checker as CheckerModel } from '../server/database/models/Checker'
import { PublishedChecker as PublishedCheckerModel } from '../server/database/models/PublishedChecker'
import { User } from './user'
import { Unit } from 'mathjs'

export type VariableResults = Record<
  string,
  string | number | Record<string, number> | Unit
>

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

export type Checker = Pick<
  CheckerModel,
  'id',
  'title',
  'description',
  'fields',
  'constants',
  'operations',
  'displays'
>

export type CreatePublishedCheckerDTO = Pick<
  CheckerModel,
  'title',
  'description',
  'fields',
  'constants',
  'operations',
  'displays'
>

export type GetPublishedCheckerWithoutDraftCheckerDTO = Pick<
  PublishedCheckerModel,
  'id',
  'title',
  'description',
  'fields',
  'constants',
  'operations',
  'displays',
  'createdAt',
  'updatedAt',
  'checkerId'
>

export type ConfigArrayName = 'fields' | 'operations' | 'displays' | 'constants'

export interface Field {
  id: string
  type: FieldType
  title: string
  description: string
  options: FieldOption[]
}

export interface FieldOption {
  label: string
  value: number
}

export type FieldType =
  | 'NUMERIC'
  | 'RADIO'
  | 'DROPDOWN'
  | 'CHECKBOX'
  | 'SLIDER'
  | 'DATE'

export interface Display {
  id: string
  type: DisplayType
  targets: string[]
}

export type DisplayType = 'TEXT' | 'BUTTON' | 'LINE'

export interface Operation {
  id: string
  type: OperationType
  title: string
  expression: string
  show: boolean
}

export type OperationType = 'ARITHMETIC' | 'IFELSE' | 'MAP' | 'DATE'

export interface TableElem {
  key: string
  value: number
}

export interface Constant {
  id: string
  title: string
  table: TableElem[]
}
