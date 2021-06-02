export type ConditionType = 'AND' | 'OR'

export interface Condition {
  type: ConditionType
  expression: string
}

export interface IfelseState {
  ifExpr: string
  conditions: Condition[]
  elseExpr: string
  thenExpr: string
}
