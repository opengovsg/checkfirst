import { reducer, FormActionType } from '../CheckerContext'

describe('CheckerContext reducer', () => {
  // Placeholder test for reducer
  it('should return state by default', () => {
    const action = { type: FormActionType.Add }
    const state = { title: 'Test' }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(state)
  })
})
