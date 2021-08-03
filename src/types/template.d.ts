import { Checker as CheckerModel } from '../server/database/models'

export type Template = Pick<
  CheckerModel,
  | 'id'
  | 'title'
  | 'description'
  | 'fields'
  | 'constants'
  | 'operations'
  | 'displays'
>
export default Template
