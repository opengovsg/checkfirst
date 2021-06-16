import React from 'react'
import { BiCalculator } from 'react-icons/bi'
import {
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  useStyles,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { ExpressionInput } from './ExpressionInput'
import { FormulaPreview } from './FormulaPreview'

const InputComponent: OperationFieldComponent = ({ operation, index }) => {
  const { title, expression } = operation
  const { dispatch } = useCheckerContext()
  const commonStyles = useStyles()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...operation, [name]: value },
        configArrName: ConfigArrayEnum.Operations,
      },
    })
  }

  const handleExpressionChange = (name: string, value: string) => {
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...operation, [name]: value },
        configArrName: ConfigArrayEnum.Operations,
      },
    })
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiCalculator />}
        />
        <Input
          name="title"
          sx={commonStyles.fieldInput}
          type="text"
          placeholder="Operation title"
          onChange={handleChange}
          value={title}
        />
      </InputGroup>
      <HStack>
        <ExpressionInput
          name="expression"
          sx={commonStyles.expressionInput}
          type="text"
          value={expression}
          onChange={(expression) =>
            handleExpressionChange('expression', expression)
          }
        />
      </HStack>
    </VStack>
  )
}

const PreviewComponent: OperationFieldComponent = ({ operation }) => {
  const { show, title, expression } = operation
  return (
    <FormulaPreview
      show={show}
      title={title}
      expression={expression}
      icon={BiCalculator}
    />
  )
}

export const CalculatedResult = createBuilderField(
  InputComponent,
  PreviewComponent
)
