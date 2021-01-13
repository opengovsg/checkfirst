import { create, all } from 'mathjs'
const config = {}
const math = create(all, config)

function OpArithmetic(
  expression: string,
  variables: Record<string, any>
): number {
  const node = math.parse!(expression)
  const code = node.compile()
  return code.evaluate(variables)
}

export { OpArithmetic }
