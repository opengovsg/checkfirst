import { reducer } from '../CheckerContext'
import { BuilderAction } from '../../../types/builder'
import {
  Checker,
  Field,
  Operation,
  Display,
  Constant,
  // ConfigArrayEnum
} from '../../../types/checker'

import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'

// Objects for the initial checker
const initialField: Field = {
  id: 'initial_field',
  type: 'NUMERIC',
  description: 'Initial field',
  help: '',
  options: [],
}
const initialOperation: Operation = {
  id: 'initial_operation',
  type: 'ARITHMETIC',
  expression: '2 * 8',
}
const initialDisplay: Display = {
  id: 'initial_display',
  type: 'TEXT',
  targets: ['initial_field'],
}
const initialConstant: Constant = {
  id: 'initial_constant',
  value: 'Initial constant string',
}
const initialChecker: Checker = {
  id: 'Initial',
  title: 'Checker test',
  fields: [initialField],
  operations: [initialOperation],
  constants: [initialConstant],
  displays: [initialDisplay],
}

// Objects to be used by the test cases
const newField: Field = {
  id: 'new_field',
  type: 'NUMERIC',
  description: 'a Field object to test actions on the Builder',
  help: '',
  options: [],
}
const newOperation: Operation = {
  id: 'new_operation',
  type: 'ARITHMETIC',
  expression: '1 + 2',
}
const newDisplay: Display = {
  id: 'new_display',
  type: 'TEXT',
  targets: ['initial_operation'],
}
const newConstant: Constant = {
  id: 'new_constant',
  value: 'New constant string',
}

describe('Testing CheckerContext reducer add actions', () => {
  it('should return state with added field', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Add,
      payload: { element: newField, configArrName: ConfigArrayEnum.Fields, newIndex: 1 },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      fields: [initialField, newField],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with added operation', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Add,
      payload: {
        element: newOperation,
        configArrName: ConfigArrayEnum.Operations,
        newIndex: 1
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      operations: [initialOperation, newOperation],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with added display', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Add,
      payload: { element: newDisplay, configArrName: ConfigArrayEnum.Displays, newIndex: 1 },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      displays: [initialDisplay, newDisplay],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with added constant', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Add,
      payload: {
        element: newConstant,
        configArrName: ConfigArrayEnum.Constants,
        newIndex: 1
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      constants: [initialConstant, newConstant],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })
})

describe('Testing CheckerContext reducer remove actions', () => {
  const initialElementIndex = 0
  it('should return state with removed field', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Remove,
      payload: {
        currIndex: initialElementIndex,
        configArrName: ConfigArrayEnum.Fields,
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      fields: [],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with removed operation', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Remove,
      payload: {
        currIndex: initialElementIndex,
        configArrName: ConfigArrayEnum.Operations,
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      operations: [],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with removed display', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Remove,
      payload: {
        currIndex: initialElementIndex,
        configArrName: ConfigArrayEnum.Displays,
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      displays: [],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with removed constant', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Remove,
      payload: {
        currIndex: initialElementIndex,
        configArrName: ConfigArrayEnum.Constants,
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      constants: [],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })
})

describe('Testing CheckerContext reducer update actions', () => {
  const initialElementIndex = 0
  it('should return state with updated field', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Update,
      payload: {
        element: newField,
        configArrName: ConfigArrayEnum.Fields,
        currIndex: initialElementIndex,
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      fields: [newField],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with updated operation', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Update,
      payload: {
        element: newOperation,
        configArrName: ConfigArrayEnum.Operations,
        currIndex: initialElementIndex,
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      operations: [newOperation],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with updated display', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Update,
      payload: {
        element: newDisplay,
        configArrName: ConfigArrayEnum.Displays,
        currIndex: initialElementIndex,
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      displays: [newDisplay],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with updated constant', () => {
    const action: BuilderAction = {
      type: BuilderActionEnum.Update,
      payload: {
        element: newConstant,
        configArrName: ConfigArrayEnum.Constants,
        currIndex: initialElementIndex,
      },
    }
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      constants: [newConstant],
    }

    const updatedState = reducer(state, action)
    expect(updatedState).toEqual(expectedState)
  })
})

describe('Testing CheckerContext reducer reorder actions', () => {
  const initialElementIndex = 0
  const finalElementIndex = 1
  it('should return state with reordered field', () => {
    const addAction: BuilderAction = {
      type: BuilderActionEnum.Add,
      payload: { element: newField, configArrName: ConfigArrayEnum.Fields, newIndex: 1 },
    }
    const reorderAction: BuilderAction = {
      type: BuilderActionEnum.Reorder,
      payload: {
        currIndex: initialElementIndex,
        newIndex: finalElementIndex,
        configArrName: ConfigArrayEnum.Fields,
      },
    }
    const actionsArray = [addAction, reorderAction]
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      fields: [newField, initialField],
    }

    const updatedState = actionsArray.reduce(reducer, state)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with reordered operation', () => {
    const addAction: BuilderAction = {
      type: BuilderActionEnum.Add,
      payload: {
        element: newOperation,
        configArrName: ConfigArrayEnum.Operations,
        newIndex: 1
      },
    }
    const reorderAction: BuilderAction = {
      type: BuilderActionEnum.Reorder,
      payload: {
        currIndex: initialElementIndex,
        newIndex: finalElementIndex,
        configArrName: ConfigArrayEnum.Operations,
      },
    }
    const actionsArray = [addAction, reorderAction]
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      operations: [newOperation, initialOperation],
    }

    const updatedState = actionsArray.reduce(reducer, state)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with reordered display', () => {
    const addAction: BuilderAction = {
      type: BuilderActionEnum.Add,
      payload: {
        element: newDisplay,
        configArrName: ConfigArrayEnum.Displays,
        newIndex: 1
      },
    }
    const reorderAction: BuilderAction = {
      type: BuilderActionEnum.Reorder,
      payload: {
        currIndex: initialElementIndex,
        newIndex: finalElementIndex,
        configArrName: ConfigArrayEnum.Displays,
      },
    }
    const actionsArray = [addAction, reorderAction]
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      displays: [newDisplay, initialDisplay],
    }

    const updatedState = actionsArray.reduce(reducer, state)
    expect(updatedState).toEqual(expectedState)
  })

  it('should return state with reordered constant', () => {
    const addAction: BuilderAction = {
      type: BuilderActionEnum.Add,
      payload: {
        element: newConstant,
        configArrName: ConfigArrayEnum.Constants,
        newIndex: 1
      },
    }
    const reorderAction: BuilderAction = {
      type: BuilderActionEnum.Reorder,
      payload: {
        currIndex: initialElementIndex,
        newIndex: finalElementIndex,
        configArrName: ConfigArrayEnum.Constants,
      },
    }
    const actionsArray = [addAction, reorderAction]
    const state = initialChecker
    const expectedState = {
      ...initialChecker,
      constants: [newConstant, initialConstant],
    }

    const updatedState = actionsArray.reduce(reducer, state)
    expect(updatedState).toEqual(expectedState)
  })
})
