import * as checker from '../../../types/checker'
import {
  evaluateOperation,
  variableReducer,
  getDependencies,
  getEvaluationOrder,
  evaluate,
} from '../evaluator'

describe('Operation', () => {
  describe('custom string equality', () => {
    it('should allow [number, number] comparisons', () => {
      const expr = 'a == b'
      let output = evaluateOperation(expr, { a: 1, b: 2 })
      expect(output).toBe(false)

      output = evaluateOperation(expr, { a: 1, b: 1 })
      expect(output).toBe(true)
    })

    it('should allow [string, string] comparisons', () => {
      const expr = 'a == b'
      let output = evaluateOperation(expr, { a: 'hello', b: 'world' })
      expect(output).toBe(false)

      output = evaluateOperation(expr, { a: 'hello', b: 'hello' })
      expect(output).toBe(true)
    })

    it('should allow [string, number] comparisons', () => {
      const expr = 'a == b'
      const output = evaluateOperation(expr, { a: 1, b: 'world' })
      expect(output).toBe(false)
    })
  })

  describe('ifelse', () => {
    it('should support [string, string] outputs', () => {
      const expr = 'ifelse(a > b, "hello", "world")'
      const output = evaluateOperation(expr, { a: 2, b: 1 })
      expect(output).toBe('hello')
    })

    it('should support [number, number] outputs', () => {
      const expr = 'ifelse(a > b, 10, 20)'
      const output = evaluateOperation(expr, { a: 2, b: 1 })
      expect(output).toBe(10)
    })

    it('should support [string, number] outputs', () => {
      const expr = 'ifelse(a > b, "hello", 20)'
      const output = evaluateOperation(expr, { a: 2, b: 1 })
      expect(output).toBe('hello')
    })

    it('should support [number, string] outputs', () => {
      const expr = 'ifelse(a > b, 10, "hello")'
      const output = evaluateOperation(expr, { a: 2, b: 1 })
      expect(output).toBe(10)
    })

    it('should not accept a string conditional', () => {
      const expr = 'ifelse("test", "hello", "world")'
      expect(() => evaluateOperation(expr, {})).toThrowError()
    })

    it('should not accept a number conditional', () => {
      const expr = 'ifelse(1, "hello", "world")'
      expect(() => evaluateOperation(expr, {})).toThrowError()
    })
  })
})

describe('variableReducer', () => {
  it('should apply evaluateOperation and accumulate variables', () => {
    const op: checker.Operation = {
      id: 'OUTPUT',
      type: 'ARITHMETIC',
      expression: 'a + b',
    }
    const inputs = { a: 1, b: 1 }
    const vars = variableReducer(inputs, op)

    expect(vars).toEqual({ ...inputs, OUTPUT: 2 })
  })
})

describe('getDependencies', () => {
  const toArray = (s: Set<string>) => Array.from(s).sort()

  it('should extract all dependencies from expression', () => {
    const expression = 'A + B - C * 1000'
    const dependencies = getDependencies(expression)

    expect(toArray(dependencies)).toEqual(['A', 'B', 'C'])
  })

  it('should only extract variables from expressions with functions', () => {
    const expression = 'ifelse(A == B, max(C, 100), D * 1000)'
    const dependencies = getDependencies(expression)

    expect(toArray(dependencies)).toEqual(['A', 'B', 'C', 'D'])
  })
})

describe('getEvaluationOrder', () => {
  it('should return evaluation order sorted by dependencies', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [{ id: 'C1', value: 'test' }]
    const operations: checker.Operation[] = [
      { id: 'O2', type: 'ARITHMETIC', expression: 'A + B' },
      { id: 'O1', type: 'ARITHMETIC', expression: 'O2 + A + B' },
    ]

    const order = getEvaluationOrder(inputs, constants, operations)
    expect(order['O1']).toBeGreaterThan(order['O2'])
  })

  it('should throw an error when there are variables that do not exists', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [{ id: 'C1', value: 'test' }]
    const operations: checker.Operation[] = [
      { id: 'O2', type: 'ARITHMETIC', expression: 'A + B' },
      { id: 'O1', type: 'ARITHMETIC', expression: 'O3 + A + B' },
    ]

    expect(() =>
      getEvaluationOrder(inputs, constants, operations)
    ).toThrowError(/\b(not exists)\b/)
  })

  it('should throw an error when there exists circular dependencies', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [{ id: 'C1', value: 'test' }]
    const operations: checker.Operation[] = [
      { id: 'O2', type: 'ARITHMETIC', expression: 'O1 + A + B' },
      { id: 'O1', type: 'ARITHMETIC', expression: 'O2 + A + B' },
    ]

    expect(() =>
      getEvaluationOrder(inputs, constants, operations)
    ).toThrowError(/\bCycles\b/)
  })
})

describe('evaluate', () => {
  it('should evaluate based on the correct evaluation order', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [{ id: 'C1', value: 'test' }]
    const operations: checker.Operation[] = [
      { id: 'O2', type: 'ARITHMETIC', expression: 'A + B' },
      { id: 'O1', type: 'ARITHMETIC', expression: 'O2 + A + B' },
    ]
    const output = evaluate(inputs, constants, operations)

    expect(output['O1']).toEqual(4)
    expect(output['O2']).toEqual(2)
  })

  it('should throw an error when there are variables that do not exists', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [{ id: 'C1', value: 'test' }]
    const operations: checker.Operation[] = [
      { id: 'O2', type: 'ARITHMETIC', expression: 'A + B' },
      { id: 'O1', type: 'ARITHMETIC', expression: 'O3 + A + B' },
    ]

    expect(() => evaluate(inputs, constants, operations)).toThrowError(
      /\b(not exists)\b/
    )
  })

  it('should throw an error when there exists circular dependencies', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [{ id: 'C1', value: 'test' }]
    const operations: checker.Operation[] = [
      { id: 'O2', type: 'ARITHMETIC', expression: 'O1 + A + B' },
      { id: 'O1', type: 'ARITHMETIC', expression: 'O2 + A + B' },
    ]

    expect(() => evaluate(inputs, constants, operations)).toThrowError(
      /\bCycles\b/
    )
  })
})
