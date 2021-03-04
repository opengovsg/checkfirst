import { omit } from 'lodash'
import { CheckerSchema } from '..'

describe('CheckerSchema', () => {
  const base = {
    id: 'id',
    title: 'title',
    fields: [],
    constants: [],
    displays: [],
    operations: [],
  }

  describe('checker metadata', () => {
    it('should throw an error if id or title is undefined', () => {
      const required = ['id', 'title']
      required.forEach((key) => {
        const checker = omit(base, key)
        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should throw an error if id or title is empty', () => {
      const required = ['id', 'title']
      required.forEach((key) => {
        const checker = { ...base, [key]: '' }
        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should allow an empty string as description', () => {
      const checker = { ...base, description: '' }
      const { error } = CheckerSchema.validate(checker)
      expect(error).toBeUndefined()
    })
  })

  describe('fields', () => {
    const baseField = {
      id: 'N1',
      type: 'NUMERIC',
      title: 'Numeric field',
      description: 'Description of field',
      options: [],
    }

    it('should throw an error if fields is undefined', () => {
      const checker = omit(base, 'fields')
      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })

    it('should throw an error if any field property is undefined', () => {
      Object.keys(baseField).forEach((key) => {
        const fields = [omit(baseField, key)]
        const checker = { ...base, fields }

        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should throw an error if id, type or title are empty', () => {
      const nonEmpty = ['id', 'type', 'title']
      nonEmpty.forEach((key) => {
        const fields = [{ ...baseField, [key]: '' }]
        const checker = { ...base, fields }

        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should allow description to be empty', () => {
      const fields = [{ ...baseField, description: '' }]
      const checker = { ...base, fields }

      const { error } = CheckerSchema.validate(checker)
      expect(error).toBeUndefined()
    })

    it('should throw an error if type of field is not valid', () => {
      const fields = [{ ...baseField, type: 'INVALID' }]
      const checker = { ...base, fields }

      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })

    it('should throw an error if type is NUMERIC and options property is not empty', () => {
      const field = {
        ...baseField,
        type: 'NUMERIC',
        options: [{ label: 'test', value: 0 }],
      }
      const checker = { ...base, fields: [field] }

      const { error } = CheckerSchema.validate(checker)
      expect(error?.message).toMatch(/(must contain 0 items)/)
    })

    it('should throw an error if type is RADIO/CHECKBOX and options property is empty', () => {
      const optionFields = ['RADIO', 'CHECKBOX']
      optionFields.forEach((type) => {
        const field = {
          ...baseField,
          type,
          options: [],
        }
        const checker = { ...base, fields: [field] }

        const { error } = CheckerSchema.validate(checker)
        expect(error?.message).toMatch(/(must contain at least 1 item)/)
      })
    })

    it('should throw an error if the option is not a valid schema', () => {
      const field = {
        ...baseField,
        type: 'RADIO',
        options: [{ x: 0 }],
      }
      const checker = { ...base, fields: [field] }

      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })
  })

  describe('operations', () => {
    const baseOp = {
      id: 'O1',
      type: 'ARITHMETIC',
      title: 'Operation',
      expression: '1 + 1',
      show: true,
    }

    it('should throw an error if operations is undefined', () => {
      const checker = omit(base, 'operations')
      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })

    it('should throw an error if any operation property is undefined', () => {
      Object.keys(baseOp).forEach((key) => {
        const operations = [omit(baseOp, key)]
        const checker = { ...base, operations }

        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should throw an error if id, type, title and expression are empty', () => {
      const nonEmpty = ['id', 'type', 'title', 'expression']
      nonEmpty.forEach((key) => {
        const operations = [{ ...baseOp, [key]: '' }]
        const checker = { ...base, operations }

        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should throw an error if type of operation is not valid', () => {
      const fields = [{ ...baseOp, type: 'INVALID' }]
      const checker = { ...base, fields }

      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })
  })

  describe('constants', () => {
    const baseConstant = {
      id: 'T1',
      title: 'title',
      table: [{ key: 'A', value: 1 }],
    }

    it('should not throw an error if constant is valid', () => {
      const checker = { ...base, constants: [baseConstant] }

      const { error } = CheckerSchema.validate(checker)
      expect(error).toBeUndefined()
    })

    it('should throw an error if constants is undefined', () => {
      const checker = omit(base, 'constants')
      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })

    it('should throw an error if any constant property is undefined', () => {
      Object.keys(baseConstant).forEach((key) => {
        const constants = [omit(baseConstant, key)]
        const checker = { ...base, constants }

        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should throw an error if any constant property is empty', () => {
      Object.keys(baseConstant).forEach((key) => {
        const constants = [{ ...baseConstant, [key]: '' }]
        const checker = { ...base, constants }

        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should throw an error if mapping table entry is invalid', () => {
      const table = [{ key: 'A' }]
      const constants = [{ ...baseConstant, table }]
      const checker = { ...base, constants }

      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })
  })

  describe('displays', () => {
    const baseDisplay = {
      id: 'C1',
      type: 'TEXT',
      targets: ['O1'],
    }

    it('should throw an error if displays is undefined', () => {
      const checker = omit(base, 'displays')
      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })

    it('should throw an error if any display property is undefined', () => {
      Object.keys(baseDisplay).forEach((key) => {
        const displays = [omit(baseDisplay, key)]
        const checker = { ...base, displays }

        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should throw an error if any display property is empty', () => {
      const nonEmpty = ['id', 'type']
      nonEmpty.forEach((key) => {
        const displays = [{ ...baseDisplay, [key]: '' }]
        const checker = { ...base, displays }

        const { error } = CheckerSchema.validate(checker)
        expect(error).not.toBeUndefined()
      })
    })

    it('should throw an error if type of display is not valid', () => {
      const displays = [{ ...baseDisplay, type: 'INVALID' }]
      const checker = { ...base, displays }

      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })

    it('should throw an error if targets has length < 1', () => {
      const displays = [{ ...baseDisplay, targets: [] }]
      const checker = { ...base, displays }

      const { error } = CheckerSchema.validate(checker)
      expect(error).not.toBeUndefined()
    })
  })
})
