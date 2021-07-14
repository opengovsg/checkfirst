import { BuilderField } from './BuilderField'
import { ActionButton } from './ActionButton'
import { questions } from './questions'
import { constants } from './constants'
import { logic } from './logic'

export const builder = {
  BuilderField,
  ActionButton,
  ...questions,
  ...constants,
  ...logic,
}
