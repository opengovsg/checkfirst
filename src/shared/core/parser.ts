import * as mathjs from 'mathjs'
import { math } from './evaluator'
import { Condition, IfelseState } from '../../types/conditional'

/**
 * Parse conditional expression into separate parts
 * @param expression ifelse expression string
 */
export const parseConditionalExpr = (expression: string): IfelseState => {
  const root = math.parse!(expression)
  const { name, args } = root

  // Parsing is only support for expression in the form of ifelse(CONDITION, THEN, ELSE)
  if (name !== 'ifelse') throw new Error('Not ifelse expression')
  if (args?.length !== 3)
    throw new Error('Invalid number of args for ifelse expression')

  const [conditionNode, thenNode, elseNode] = args
  const thenExpr = thenNode.toString().trim()
  const elseExpr = elseNode.toString().trim()

  /*
    Do a depth-first traversal of the mathjs expression tree to parse conditional expression.
    For example, parsing`A == 1 or (B == 2) or (C == 3)` will create the following tree:
              or
             /  \
            or   C == 3
           /  \
      A == 1  B == 2
  */
  const dfs = (node: mathjs.MathNode, conds: string[], ops: string[]) => {
    const { op, args } = node
    if (op !== 'and' && op !== 'or')
      return conds.push(
        node.toString({
          handler: (node: mathjs.MathNode) => {
            // Override toString for ConstantNode to always use fixed notation
            if (node.type === 'ConstantNode')
              return mathjs.format(node.value, { notation: 'fixed' })
          },
        })
      )
    if (!args || args.length !== 2) return

    const [left, right] = args
    ops.push(op)
    dfs(left, conds, ops)
    dfs(right, conds, ops)
  }

  const conds: string[] = []
  const ops: string[] = []
  dfs(conditionNode, conds, ops)

  const conditions: Condition[] = conds.slice(1).map((c, i) => {
    const expression =
      c[0] === '(' && c[c.length - 1] === ')' ? c.substring(1, c.length - 1) : c
    return {
      expression: expression.trim(),
      type: ops[i] === 'or' ? 'OR' : 'AND',
    }
  })

  return {
    ifExpr: conds[0].trim(),
    conditions,
    thenExpr,
    elseExpr,
  }
}
