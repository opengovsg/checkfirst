import * as checker from '../../../types/checker'
import {
  evaluateOperation,
  variableReducer,
  getDependencies,
  getEvaluationOrder,
  evaluate,
  EvaluationCycleError,
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

  describe('blacklisted functions', () => {
    it('should prevent evaluate from being called inline', () => {
      const expr = 'evaluate(1 + 1)'
      expect(() => evaluateOperation(expr, {})).toThrowError(/\b(evaluate)\b/)
    })

    it('should prevent createUnit from being called inline', () => {
      const expr = 'createUnit("x")'
      expect(() => evaluateOperation(expr, {})).toThrowError(/\b(createUnit)\b/)
    })

    it('should prevent simplify from being called inline', () => {
      const expr = 'simplify(1 + 1)'
      expect(() => evaluateOperation(expr, {})).toThrowError(/\b(simplify)\b/)
    })

    it('should prevent derivative from being called inline', () => {
      const expr = 'derivative("x^2", "x")'
      expect(() => evaluateOperation(expr, {})).toThrowError(/\b(derivative)\b/)
    })

    it('should prevent parse from being called inline', () => {
      const expr = 'parse(1 + 1)'
      expect(() => evaluateOperation(expr, {})).toThrowError(/\b(parse)\b/)
    })
  })
})

describe('countif', () => {
  it('should support [string[], string] inputs', () => {
    const expr = 'countif([a, b], "hi")'
    const output = evaluateOperation(expr, { a: 'hi', b: 'hello' })
    expect(output).toBe(1)
  })

  it('should support [number[], number] inputs', () => {
    const expr = 'countif([a, b], 7)'
    const output = evaluateOperation(expr, { a: 7, b: 8 })
    expect(output).toBe(1)
  })

  it('should not accept a non-array inputs as the first argument', () => {
    const expr = 'countif(a, 7)'
    expect(() => evaluateOperation(expr, { a: 7 })).toThrowError()
  })
})

describe('link', () => {
  function expectedLink(displayText: string, url: string) {
    return `<a class="inline-external-link" target="_blank" rel="noopener noreferrer" href="${url}">${displayText}</a>`
  }

  it('should return an HTML link', () => {
    const displayText = 'Google'
    const url = 'https://google.com'
    const expr = `link("${displayText}", "${url}")`

    const output = evaluateOperation(expr, {})
    expect(output).toBe(expectedLink(displayText, url))
  })

  it('should support concatenation with another string', () => {
    const displayText = 'Google'
    const url = 'https://google.com'
    const expr = `"Hello " + link("${displayText}", "${url}")`

    const output = evaluateOperation(expr, {})
    expect(output).toBe(`Hello ${expectedLink(displayText, url)}`)
  })

  it('should append https by default when protocol is not provided', () => {
    const displayText = 'Google'
    const url = 'google.com'
    const expr = `"Hello " + link("${displayText}", "${url}")`

    const output = evaluateOperation(expr, {})

    const normalizedUrl = `https://${url}`
    expect(output).toBe(`Hello ${expectedLink(displayText, normalizedUrl)}`)
  })

  it('should strip off all HTML tags in display text', () => {
    const displayText = '<b>Google</b><script>const a = 1</script>'
    const url = 'https://google.com'
    const expr = `"Hello " + link("${displayText}", "${url}")`

    const output = evaluateOperation(expr, {})

    const sanitizedText = 'Google'
    expect(output).toBe(`Hello ${expectedLink(sanitizedText, url)}`)
  })

  it('should strip off all HTML tags in link', () => {
    const displayText = 'Google'
    const url = '<b>https://google.com</b><script>const a = 1</script>'
    const expr = `"Hello " + link("${displayText}", "${url}")`

    const output = evaluateOperation(expr, {})

    const sanitizedLink = 'https://google.com'
    expect(output).toBe(`Hello ${expectedLink(displayText, sanitizedLink)}`)
  })
})

describe('variableReducer', () => {
  it('should apply evaluateOperation and accumulate variables', () => {
    const op: checker.Operation = {
      id: 'OUTPUT',
      type: 'ARITHMETIC',
      expression: 'a + b',
      title: '',
      show: true,
    }
    const inputs = { a: 1, b: 1 }
    const vars = variableReducer(inputs, op)

    expect(vars).toEqual({ ...inputs, OUTPUT: 2 })
  })
})

describe('getDependencies', () => {
  const toArray = (s: Set<string>) => Array.from(s).sort()

  it('should extract all dependencies from expression', () => {
    const expression = 'A1 + B1 - C1 * 1000'
    const dependencies = getDependencies(expression)

    expect(toArray(dependencies)).toEqual(['A1', 'B1', 'C1'])
  })

  it('should only extract variables from expressions with functions', () => {
    const expression = 'ifelse(A1 == B1, max(C1, 100), D1 * 1000)'
    const dependencies = getDependencies(expression)

    expect(toArray(dependencies)).toEqual(['A1', 'B1', 'C1', 'D1'])
  })
})

describe('getEvaluationOrder', () => {
  it('should return evaluation order sorted by dependencies', () => {
    const inputs = { A1: 1, B1: 1 }
    const constants: checker.Constant[] = [
      {
        id: 'T1',
        title: 'Test table',
        table: [{ key: 'test', value: 2 }],
      },
    ]
    const operations: checker.Operation[] = [
      {
        id: 'O2',
        type: 'ARITHMETIC',
        expression: 'A1 + B1',
        title: '',
        show: true,
      },
      {
        id: 'O1',
        type: 'ARITHMETIC',
        expression: 'O2 + A1 + B1',
        title: '',
        show: true,
      },
    ]

    const order = getEvaluationOrder(inputs, constants, operations)
    expect(order['O1']).toBeGreaterThan(order['O2'])
  })

  it('should throw an error when there are variables that do not exists', () => {
    const inputs = { A1: 1, B1: 1 }
    const constants: checker.Constant[] = [
      {
        id: 'T1',
        title: 'Test table',
        table: [{ key: 'test', value: 2 }],
      },
    ]
    const operations: checker.Operation[] = [
      {
        id: 'O2',
        type: 'ARITHMETIC',
        expression: 'A1 + B1',
        title: '',
        show: true,
      },
      {
        id: 'O1',
        type: 'ARITHMETIC',
        expression: 'O3 + A1 + B1',
        title: '',
        show: true,
      },
    ]

    expect(() =>
      getEvaluationOrder(inputs, constants, operations)
    ).toThrowError(/\b(not exists)\b/)
  })

  it('should throw an error when there exists circular dependencies', () => {
    const inputs = { A1: 1, B1: 1 }
    const constants: checker.Constant[] = [
      {
        id: 'T1',
        title: 'Test table',
        table: [{ key: 'test', value: 2 }],
      },
    ]
    const operations: checker.Operation[] = [
      {
        id: 'O2',
        type: 'ARITHMETIC',
        expression: 'O1 + A1 + B1',
        title: '',
        show: true,
      },
      {
        id: 'O1',
        type: 'ARITHMETIC',
        expression: 'O2 + A1 + B1',
        title: '',
        show: true,
      },
    ]

    try {
      getEvaluationOrder(inputs, constants, operations)
    } catch (err) {
      expect(err).toBeInstanceOf(EvaluationCycleError)

      const { cycles } = err as EvaluationCycleError
      expect(cycles.map((cycle) => cycle.sort())).toEqual([['O1', 'O2']])
    }
  })
})

describe('evaluate', () => {
  it('should evaluate based on the correct evaluation order', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [
      {
        id: 'T1',
        title: 'Test table',
        table: [{ key: 'test', value: 2 }],
      },
    ]
    const operations: checker.Operation[] = [
      {
        id: 'O2',
        type: 'ARITHMETIC',
        expression: 'A + B',
        title: '',
        show: true,
      },
      {
        id: 'O1',
        type: 'ARITHMETIC',
        expression: 'O2 + A + B',
        title: '',
        show: true,
      },
    ]
    const output = evaluate(inputs, constants, operations)

    expect(output['O1']).toEqual(4)
    expect(output['O2']).toEqual(2)
  })

  it('should throw an error when there are variables that do not exists', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [
      {
        id: 'T1',
        title: 'Test table',
        table: [{ key: 'test', value: 2 }],
      },
    ]
    const operations: checker.Operation[] = [
      {
        id: 'O2',
        type: 'ARITHMETIC',
        expression: 'A + B',
        title: '',
        show: true,
      },
      {
        id: 'O1',
        type: 'ARITHMETIC',
        expression: 'O3 + A + B',
        title: '',
        show: true,
      },
    ]

    expect(() => evaluate(inputs, constants, operations)).toThrowError(
      /\b(not exists)\b/
    )
  })

  it('should throw an error when there exists circular dependencies', () => {
    const inputs = { A: 1, B: 1 }
    const constants: checker.Constant[] = [
      {
        id: 'T1',
        title: 'Test table',
        table: [{ key: 'test', value: 2 }],
      },
    ]
    const operations: checker.Operation[] = [
      {
        id: 'O2',
        type: 'ARITHMETIC',
        expression: 'O1 + A + B',
        title: '',
        show: true,
      },
      {
        id: 'O1',
        type: 'ARITHMETIC',
        expression: 'O2 + A + B',
        title: '',
        show: true,
      },
    ]

    try {
      evaluate(inputs, constants, operations)
    } catch (err) {
      expect(err).toBeInstanceOf(EvaluationCycleError)

      const { cycles } = err as EvaluationCycleError
      expect(cycles.map((cycle) => cycle.sort())).toEqual([['O1', 'O2']])
    }
  })
})
