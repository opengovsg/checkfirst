import { typed, create, all, factory } from 'mathjs'
import * as checker from './../../types/checker'

const config = {}
const factories = {
  ...all,
  // Override for string comparison
  createEqual: factory(
    'equal',
    [],
    () => (a: string | number, b: string | number) => {
      return a === b
    }
  ),
  createUnequal: factory(
    'unequal',
    [],
    () => (a: string | number, b: string | number) => {
      return a !== b
    }
  ),
  // Custom if-else function
  createIfElse: factory('ifelse', [], () =>
    typed('ifelse', {
      'boolean, string | number, string | number': (
        condition: boolean,
        a: string | number,
        b: string | number
      ) => (condition ? a : b),
    })
  ),
}
export const math = create(factories, config)

export function evaluateOperation(
  expression: string,
  variables: Record<string, string | number>
): number {
  return math.evaluate!(expression, variables)
}

export const variableReducer = (
  accVariables: Record<string, string | number>,
  op: checker.Operation
): Record<string, string | number> => {
  const { id, expression } = op
  accVariables[id] = evaluateOperation(expression, accVariables)
  return accVariables
}
