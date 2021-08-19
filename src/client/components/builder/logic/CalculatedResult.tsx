import React, { useEffect } from 'react'
import { BiCalculator } from 'react-icons/bi'
import {
  Button,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  useStyles,
  Text,
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'

import { useCheckerContext } from '../../../contexts'
import { isValidExpression } from '../../../core/evaluator'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { ExpressionInput } from './ExpressionInput'
import { FormulaPreview } from './FormulaPreview'
import { ToolbarPortal } from '../ToolbarPortal'
import { useStyledToast } from '../../common/StyledToast'

const InputComponent: OperationFieldComponent = ({
  operation,
  index,
  toolbar,
}) => {
  const { dispatch, setChanged, isChanged } = useCheckerContext()
  const commonStyles = useStyles()
  const toast = useStyledToast()

  const { handleSubmit, register, formState, control, reset } = useForm({
    defaultValues: { title: operation.title, expression: operation.expression },
  })
  useEffect(() => {
    setChanged(formState.isDirty)
  }, [formState.isDirty, setChanged])

  const handleSave: React.MouseEventHandler = async (_event) => {
    handleSubmit(
      ({ expression, title }) => {
        dispatch({
          type: BuilderActionEnum.Update,
          payload: {
            currIndex: index,
            element: {
              ...operation,
              expression,
              title,
            },
            configArrName: ConfigArrayEnum.Operations,
          },
        })
        reset(undefined, { keepValues: true, keepDirty: false })
        toast({
          status: 'success',
          description: 'Logic block updated',
        })
      },
      () => {
        toast({
          status: 'error',
          description: 'Unable to save logic block',
        })
      }
    )()
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiCalculator />}
        />
        <Input
          type="text"
          placeholder="Operation title"
          sx={commonStyles.fieldInput}
          {...register('title', {
            required: { value: true, message: 'Title cannot be empty' },
          })}
          isInvalid={!!formState.errors.title}
        />
      </InputGroup>
      <Text fontSize="sm" color="error.500">
        {formState.errors.title?.message}
      </Text>
      <HStack>
        <Controller
          name="expression"
          control={control}
          rules={{
            required: { value: true, message: 'Expression cannot be empty' },
            validate: (expr) => isValidExpression(expr) || 'Invalid expression',
          }}
          render={({
            field: { name, value, onChange, ref },
            fieldState: { invalid },
          }) => {
            return (
              <ExpressionInput
                name={name}
                sx={commonStyles.expressionInput}
                type="text"
                value={value}
                onChange={onChange}
                isInvalid={invalid}
                refCallback={ref}
              />
            )
          }}
        />
      </HStack>
      <Text fontSize="sm" color="error.500">
        {formState.errors.expression?.message}
      </Text>
      <ToolbarPortal container={toolbar}>
        <Button
          isDisabled={!isChanged}
          colorScheme="primary"
          onClick={handleSave}
        >
          Save
        </Button>
      </ToolbarPortal>
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
