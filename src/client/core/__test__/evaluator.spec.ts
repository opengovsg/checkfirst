import * as checker from '../../../types/checker'
import { operation, evaluateOperation } from '../evaluator'

describe('Operation', () => {
  describe('custom string equality', () => {
    it('should allow [number, number] comparisons', () => {
      const expr = 'a == b'
      let output = operation(expr, { a: 1, b: 2 })
      expect(output).toBe(false)

      output = operation(expr, { a: 1, b: 1 })
      expect(output).toBe(true)
    })

    it('should allow [string, string] comparisons', () => {
      const expr = 'a == b'
      let output = operation(expr, { a: 'hello', b: 'world' })
      expect(output).toBe(false)

      output = operation(expr, { a: 'hello', b: 'hello' })
      expect(output).toBe(true)
    })

    it('should allow [string, number] comparisons', () => {
      const expr = 'a == b'
      const output = operation(expr, { a: 1, b: 'world' })
      expect(output).toBe(false)
    })
  })

  describe('ifelse', () => {
    it('should support [string, string] outputs', () => {
      const expr = 'ifelse(a > b, "hello", "world")'
      const output = operation(expr, { a: 2, b: 1 })
      expect(output).toBe('hello')
    })

    it('should support [number, number] outputs', () => {
      const expr = 'ifelse(a > b, 10, 20)'
      const output = operation(expr, { a: 2, b: 1 })
      expect(output).toBe(10)
    })

    it('should support [string, number] outputs', () => {
      const expr = 'ifelse(a > b, "hello", 20)'
      const output = operation(expr, { a: 2, b: 1 })
      expect(output).toBe('hello')
    })

    it('should support [number, string] outputs', () => {
      const expr = 'ifelse(a > b, 10, "hello")'
      const output = operation(expr, { a: 2, b: 1 })
      expect(output).toBe(10)
    })

    it('should not accept a string conditional', () => {
      const expr = 'ifelse("test", "hello", "world")'
      expect(() => operation(expr, {})).toThrowError()
    })

    it('should not accept a number conditional', () => {
      const expr = 'ifelse(1, "hello", "world")'
      expect(() => operation(expr, {})).toThrowError()
    })
  })
})

describe('evaluateOperation', () => {
  it('should apply operation and accumulate variables', () => {
    const op: checker.Operation = {
      id: 'OUTPUT',
      type: 'ARITHMETIC',
      expression: 'a + b',
    }
    const inputs = { a: 1, b: 1 }
    const vars = evaluateOperation(inputs, op)

    expect(vars).toEqual({ ...inputs, OUTPUT: 2 })
  })
})
