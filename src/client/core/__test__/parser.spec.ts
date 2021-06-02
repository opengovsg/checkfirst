import { parseConditionalExpr } from '../parser'

describe('parseConditional', () => {
  it('should parse expression with only one condition', () => {
    const expr = 'ifelse(R1 == "Option A", true, false)'
    const parsed = parseConditionalExpr(expr)

    expect(parsed).toMatchObject({
      ifExpr: 'R1 == "Option A"',
      conditions: [],
      thenExpr: 'true',
      elseExpr: 'false',
    })
  })

  it('should parse expression with multiple conditions', () => {
    const expr = 'ifelse(R1 == "A" or (R2 == 2) or (R3 == "C"), true, false)'
    const parsed = parseConditionalExpr(expr)

    expect(parsed).toMatchObject({
      ifExpr: 'R1 == "A"',
      conditions: [
        { expression: 'R2 == 2', type: 'OR' },
        { expression: 'R3 == "C"', type: 'OR' },
      ],
      thenExpr: 'true',
      elseExpr: 'false',
    })
  })

  it('should parse expression with and/or in quoted values', () => {
    const expr = `ifelse(R1 == "A or B" or (R2 == max(1, 2)) and (R3 == "E and F"), true, false)`
    const parsed = parseConditionalExpr(expr)

    expect(parsed).toMatchObject({
      ifExpr: `R1 == "A or B"`,
      conditions: [
        { expression: 'R2 == max(1, 2)', type: 'OR' },
        { expression: 'R3 == "E and F"', type: 'AND' },
      ],
      thenExpr: 'true',
      elseExpr: 'false',
    })
  })

  it('should parse expression with parentheses in quoted values', () => {
    const expr = `ifelse(R1 == "A (Singaporean or PR)" or (R2 == "B (Foreign Residents)"), true, false)`
    const parsed = parseConditionalExpr(expr)

    expect(parsed).toMatchObject({
      ifExpr: `R1 == "A (Singaporean or PR)"`,
      conditions: [{ expression: 'R2 == "B (Foreign Residents)"', type: 'OR' }],
      thenExpr: 'true',
      elseExpr: 'false',
    })
  })
})
