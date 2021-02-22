/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { typed, create, all, factory } from 'mathjs'
import { Graph, alg } from 'graphlib'
import * as checker from './../../types/checker'

export class EvaluationCycleError extends Error {
  cycles: string[][]

  constructor(cycles: string[][]) {
    super('Cycles detected. Computation graph my be a DAG.')
    Object.setPrototypeOf(this, new.target.prototype)

    this.cycles = cycles
  }
}

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
  // Custom count-if function
  createCountIf: factory('countif', [], () =>
    typed('countif', {
      'Array, string | number': (
        elemArray: string[] | number[],
        comparedElem: string | number
      ) => {
        let count = 0
        elemArray.forEach((elem: string | number) => {
          if (elem === comparedElem) count++
        })
        return count
      },
    })
  ),
}
export const math = create(factories, config)

const BLACKLIST = [
  'evaluate',
  'createUnit',
  'simplify',
  'derivative',
  'import',
  'parse',
]
export const evaluateOperation = (
  expression: string,
  variables: Record<string, string | number>
): number => {
  const node = math.parse!(expression)
  const blacklisted = node.filter(
    (n) => n.isFunctionNode && n.name && BLACKLIST.includes(n.name)
  )
  if (blacklisted.length > 0) {
    const functionNames = blacklisted.map((n) => n.name).join(', ')
    throw new Error(`The following functions are not allowed: ${functionNames}`)
  }

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

/**
 * Extract all variables from a given mathjs expression
 * @param expression mathjs expression
 */
export const getDependencies = (expression: string): Set<string> => {
  // Parse the mathjs expression into an expression tree
  const node = math.parse!(expression)

  // Traverse tree to extract symbols and functions
  const dependencies = new Set<string>()
  const functions: string[] = []
  node.traverse((node) => {
    if (node.isFunctionNode && node.name) functions.push(node.name)
    if (node.isSymbolNode && node.name) dependencies.add(node.name)
  })

  // Functions are also SymbolNodes. However, we only want variable nodes.
  functions.forEach((f) => dependencies.delete(f))
  return dependencies
}

/**
 * Given inputs, constants and operations, determine what is the correct order of evaluation
 * @param input
 * @param constants
 * @param operation
 * @return order Order to evaluate inputs, constants and operations
 * @throws Error when there is a cycle in the graph or invalid variables
 */
export const getEvaluationOrder = (
  inputs: Record<string, string | number>,
  constants: checker.Constant[],
  operations: checker.Operation[]
): Record<string, number> => {
  // Initialize a directed acyclic graph
  let graph = new Graph({ directed: true })

  // Add all nodes to graph
  graph = Object.keys(inputs).reduce((g, key) => {
    g.setNode(key)
    return g
  }, graph)
  graph = constants.reduce((g, constant) => {
    g.setNode(constant.id)
    return g
  }, graph)
  graph = operations.reduce((g, op) => {
    g.setNode(op.id)
    return g
  }, graph)

  // Validate that dependencies exists and add directed edges in graph
  graph = operations.reduce((g, op) => {
    const { id, expression } = op
    const deps = getDependencies(expression)
    deps.forEach((d) => {
      // Check that the dependency exists
      if (!g.hasNode(d)) {
        throw new Error(`Variable ${d} does not exists.`)
      }
      g.setEdge(d, id)
    })

    return g
  }, graph)

  // In order for computation to be valid, the constructed graph must be acyclical.
  const cycles = alg.findCycles(graph)
  if (cycles.length > 0) throw new EvaluationCycleError(cycles)

  // Do a topological sort to determine evaluation order. Return as map for O(1) lookup.
  let order: Record<string, number> = {}
  order = alg.topsort(graph).reduce((o, key, index) => {
    o[key] = index
    return o
  }, order)

  return order
}

/**
 * Evaluate operations with inputs and constants
 * @param input
 * @param constants
 * @param operation
 * @return variables Record holding the results of evaluation the operations
 * @throws Error when there is a cycle in the graph or invalid variables
 */
export const evaluate = (
  inputs: Record<string, string | number>,
  constants: checker.Constant[],
  operations: checker.Operation[]
): Record<string, string | number> => {
  let variables = { ...inputs }
  const evalOrder = getEvaluationOrder(inputs, constants, operations)

  variables = constants.reduce((vars, { id, table }) => {
    // Convert table array to record/object
    const tableObj = table.reduce((obj, { key, value }) => {
      obj[key] = value
      return obj
    }, <Record<string, number>>{})

    // Evaluate stringified object - the only way to
    // obtain a non-escaped string of the object.
    vars[id] = math.evaluate!(JSON.stringify(tableObj))
    return vars
  }, variables)

  // Sort operations by evalution order before evaluating to ensure that all dependencies
  // are evaluated before an operation.
  variables = operations
    .sort((a, b) => evalOrder[a.id] - evalOrder[b.id])
    .reduce(variableReducer, variables)

  return variables
}

/**
 * Evaluate if expression is a valid mathjs expressionon
 */
export const isValidExpression = (expression: string): boolean => {
  try {
    math.parse!(expression)
    return true
  } catch (err) {
    return false
  }
}
