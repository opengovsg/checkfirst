import { BuilderField } from './BuilderField'
import { ActionButton } from './ActionButton'
import { questions } from './questions'
import { constants } from './constants'

export const builder = {
  BuilderField,
  ActionButton,
  ...questions,
  ...constants,
}
