import React, { useState, useEffect } from 'react'
import {
  ConditionType,
  Condition,
  IfelseState,
} from '../../../../types/conditional'
import { parseConditionalExpr } from '../../../core/parser'
import { isValidExpression } from '../../../core/evaluator'
import { BiGitBranch, BiTrash, BiChevronDown, BiPlus } from 'react-icons/bi'
import {
  Divider,
  Button,
  IconButton,
  VStack,
  HStack,
  Box,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  Text,
  useMultiStyleConfig,
  useStyles,
} from '@chakra-ui/react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { ExpressionInput } from './ExpressionInput'
import { DefaultTooltip } from '../../common/DefaultTooltip'
import { useStyledToast } from '../../common/StyledToast'
import { FormulaPreview } from './FormulaPreview'
import { ToolbarPortal } from '../ToolbarPortal'

const toExpression = (state: IfelseState): string => {
  const { ifExpr, conditions, elseExpr, thenExpr } = state
  const condition = conditions.reduce((acc, cond) => {
    return cond.expression
      ? `${acc} ${cond.type.toLowerCase()} (${cond.expression})`
      : acc
  }, ifExpr)

  return `ifelse(${condition.trim()}, ${thenExpr.trim()}, ${elseExpr.trim()})`
}

const InputComponent: OperationFieldComponent = ({
  operation,
  index,
  toolbar,
}) => {
  const { isChanged, setChanged, dispatch } = useCheckerContext()
  const commonStyles = useStyles()
  const toast = useStyledToast()
  const styles = useMultiStyleConfig('ConditionalResult', {})

  // Retrieve condition type from ifelseState if there exist conditions; else use AND type as default
  const { conditions: initialConditions, ...ifElseThen } = parseConditionalExpr(
    operation.expression
  )
  const initialConditionType: ConditionType =
    initialConditions.length > 0 ? initialConditions[0].type : 'AND'
  const [conditionType, setConditionType] = useState(initialConditionType)

  const { formState, register, control, handleSubmit, reset } = useForm<
    { title: string } & IfelseState
  >({
    defaultValues: {
      title: operation.title,
      ...ifElseThen,
      ...(initialConditions && initialConditions.length > 0
        ? { conditions: initialConditions }
        : {}),
    },
  })
  const {
    fields: conditions,
    append,
    remove,
    update,
  } = useFieldArray<{ title: string } & IfelseState>({
    control,
    name: 'conditions',
  })
  useEffect(() => {
    setChanged(Object.keys(formState.dirtyFields).length > 0)
  }, [formState, setChanged])

  const updateAllConditionTypes = (conditionType: ConditionType) => {
    // Set conditionType state
    setConditionType(conditionType)
    // Set all condition types in ifElseState
    conditions.forEach((cond, i) => update(i, { ...cond, type: conditionType }))
  }

  const addCondition = () => {
    const emptyCondition: Condition = {
      type: conditionType,
      expression: '',
    }
    append(emptyCondition)
  }

  const deleteCondition = (index: number) => {
    remove(index)
  }

  const handleSave = () => {
    handleSubmit(
      (data) => {
        const { title, ...ifelseState } = data

        const expression = toExpression(ifelseState)
        if (isValidExpression(expression)) {
          dispatch({
            type: BuilderActionEnum.Update,
            payload: {
              currIndex: index,
              element: { ...operation, title, expression },
              configArrName: ConfigArrayEnum.Operations,
            },
          })
          reset(undefined, { keepValues: true, keepDirty: false })
          toast({
            status: 'success',
            description: 'Logic block updated',
          })
        } else {
          toast({
            status: 'error',
            description: 'Unable to save logic block',
          })
        }
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
          children={<BiGitBranch />}
        />
        <Input
          type="text"
          sx={commonStyles.fieldInput}
          placeholder="Result description"
          {...register('title', {
            required: { value: true, message: 'Title cannot be empty' },
          })}
          isInvalid={!!formState.errors.title}
        />
      </InputGroup>
      <Text fontSize="sm" color="error.500">
        {formState.errors.title?.message}
      </Text>
      <HStack sx={styles.inputContainer}>
        <Text sx={styles.inputLabel}>IF</Text>
        <Controller
          name="ifExpr"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Expression cannot be empty ',
            },
            validate: (expr) => isValidExpression(expr) || 'Invalid expression',
          }}
          render={({
            field: { name, value, onChange, ref },
            fieldState: { error, invalid },
          }) => {
            return (
              <Box flex={1}>
                <ExpressionInput
                  type="text"
                  sx={commonStyles.expressionInput}
                  name={name}
                  onChange={onChange}
                  value={value}
                  isInvalid={invalid}
                  refCallback={ref}
                />
                <Text fontSize="sm" color="error.500">
                  {error?.message}
                </Text>
              </Box>
            )
          }}
        />
        <Box sx={styles.deleteSpacer} />
      </HStack>
      {conditions.map((cond, i) => (
        <HStack key={i} sx={styles.inputContainer}>
          {i === 0 ? (
            <Menu autoSelect={false}>
              <MenuButton
                as={Button}
                variant="outline"
                sx={styles.menuButton}
                rightIcon={<BiChevronDown />}
              >
                {conditionType}
              </MenuButton>
              <MenuList sx={styles.menuList}>
                <MenuItem
                  as={Button}
                  variant="ghost"
                  sx={styles.menuItem}
                  isActive={cond.type === 'AND'}
                  onClick={() => updateAllConditionTypes('AND')}
                >
                  And
                </MenuItem>
                <MenuItem
                  as={Button}
                  variant="ghost"
                  sx={styles.menuItem}
                  isActive={cond.type === 'OR'}
                  onClick={() => updateAllConditionTypes('OR')}
                >
                  Or
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Text sx={styles.spacedInputLabel}>{conditionType}</Text>
          )}
          <Controller
            control={control}
            name={`conditions.${i}.expression`}
            rules={{
              required: { value: true, message: 'Expression cannot be empty' },
              validate: (expr) =>
                isValidExpression(expr) || 'Invalid expression',
            }}
            render={({
              field: { name, value, onChange, ref },
              fieldState: { error, invalid },
            }) => {
              return (
                <Box flex={1}>
                  <ExpressionInput
                    type="text"
                    sx={commonStyles.expressionInput}
                    name={name}
                    onChange={onChange}
                    value={value}
                    isInvalid={invalid}
                    refCallback={ref}
                  />
                  <Text fontSize="sm" color="error.500">
                    {error?.message}
                  </Text>
                </Box>
              )
            }}
          />
          <DefaultTooltip label="Delete condition">
            <IconButton
              variant="ghost"
              sx={styles.deleteButton}
              aria-label="Delete condition"
              onClick={() => deleteCondition(i)}
              icon={<BiTrash />}
            />
          </DefaultTooltip>
        </HStack>
      ))}
      <Button
        variant="solid"
        sx={styles.addButton}
        colorScheme="primary"
        aria-label="Add condition"
        onClick={addCondition}
        leftIcon={<BiPlus />}
      >
        Add condition
      </Button>
      <Divider sx={styles.divider} />
      <HStack alignItems="stretch" sx={styles.inputContainer}>
        <Text sx={styles.inputLabel}>THEN</Text>
        <Controller
          name="thenExpr"
          control={control}
          rules={{
            required: { value: true, message: 'Expression cannot be empty' },
            validate: (expr) => isValidExpression(expr) || 'Invalid expression',
          }}
          render={({
            field: { name, value, onChange, ref },
            fieldState: { error, invalid },
          }) => {
            return (
              <Box flex={1}>
                <ExpressionInput
                  type="text"
                  sx={commonStyles.expressionInput}
                  placeholder="Use this field as a ‘true/false’ statement, or show a result"
                  name={name}
                  onChange={onChange}
                  value={value}
                  isInvalid={invalid}
                  refCallback={ref}
                />
                <Text fontSize="sm" color="error.500">
                  {error?.message}
                </Text>
              </Box>
            )
          }}
        />
      </HStack>
      <HStack sx={styles.inputContainer}>
        <Text sx={styles.inputLabel}>ELSE</Text>
        <Controller
          name="elseExpr"
          control={control}
          rules={{
            required: { value: true, message: 'Expression cannot be empty' },
            validate: (expr) => isValidExpression(expr) || 'Invalid expression',
          }}
          render={({
            field: { name, value, onChange },
            fieldState: { error, invalid },
          }) => {
            return (
              <Box flex={1}>
                <ExpressionInput
                  type="text"
                  sx={commonStyles.expressionInput}
                  name={name}
                  placeholder="Use this field as a ‘true/false’ statement, or show a result"
                  onChange={onChange}
                  value={value}
                  isInvalid={invalid}
                />
                <Text fontSize="sm" color="error.500">
                  {error?.message}
                </Text>
              </Box>
            )
          }}
        />
      </HStack>
      <ToolbarPortal container={toolbar}>
        <Button
          colorScheme="primary"
          onClick={handleSave}
          isDisabled={!isChanged}
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
      icon={BiGitBranch}
    />
  )
}

export const ConditionalResult = createBuilderField(
  InputComponent,
  PreviewComponent
)
