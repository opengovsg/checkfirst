import Joi from 'joi'
import { isValidExpression } from '../../shared/core/evaluator'

const expressionValidator = (expr: string): string => {
  if (!isValidExpression(expr)) throw new Error('Invalid expression')
  return expr
}

const FieldOptionsSchema = Joi.object({
  label: Joi.string().required(),
  value: Joi.number().required(),
})

const FieldSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string()
    .valid('NUMERIC', 'RADIO', 'DROPDOWN', 'CHECKBOX', 'SLIDER', 'DATE')
    .required(),
  title: Joi.string().required(),
  description: Joi.string().allow('').required(),
  options: Joi.when('type', {
    is: Joi.valid('RADIO', 'DROPDOWN', 'CHECKBOX'),
    then: Joi.array().items(FieldOptionsSchema).min(1),
    otherwise: Joi.array().length(0),
  }).required(),
})

const TableElemSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.number().required(),
})

const ConstantSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  table: Joi.array().items(TableElemSchema).required(),
})

const DisplaySchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().valid('TEXT', 'BUTTON', 'LINE').required(),
  targets: Joi.array().items(Joi.string()).min(1).required(),
})

const OperationSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().valid('ARITHMETIC', 'IFELSE', 'MAP', 'DATE').required(),
  title: Joi.string().required(),
  expression: Joi.string().custom(expressionValidator).required(),
  show: Joi.boolean().required(),
})

export const CheckerSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(''),

  fields: Joi.array().items(FieldSchema).required(),
  constants: Joi.array().items(ConstantSchema).required(),
  displays: Joi.array().items(DisplaySchema).required(),
  operations: Joi.array().items(OperationSchema).required(),
})

export const CheckerWithMetadataSchema = CheckerSchema.keys({
  createdAt: Joi.string(),
  updatedAt: Joi.string(),
  users: Joi.array(),
})
