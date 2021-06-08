import React, { useState, useEffect } from 'react'
import {
  ConditionType,
  Condition,
  IfelseState,
} from '../../../../types/conditional'
import { parseConditionalExpr } from '../../../core/parser'
import { isValidExpression } from '../../../core/evaluator'
import update, { Spec } from 'immutability-helper'
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

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { ExpressionInput } from './ExpressionInput'
import { DefaultTooltip } from '../../common/DefaultTooltip'
import { FormulaPreview } from './FormulaPreview'

const toExpression = (state: IfelseState): string => {
  const { ifExpr, conditions, elseExpr, thenExpr } = state
  const condition = conditions.reduce((acc, cond) => {
    return cond.expression
      ? `${acc} ${cond.type.toLowerCase()} (${cond.expression})`
      : acc
  }, ifExpr)

  return `ifelse(${condition.trim()}, ${thenExpr.trim()}, ${elseExpr.trim()})`
}

const InputComponent: OperationFieldComponent = ({ operation, index }) => {
  const { title, expression } = operation
  const { dispatch } = useCheckerContext()
  const [ifelseState, setIfelseState] = useState<IfelseState>(
    parseConditionalExpr(expression)
  )
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('ConditionalResult', {})

  // Retrieve condition type from ifelseState if there exist conditions; else use AND type as default
  const initialConditionType: ConditionType =
    ifelseState.conditions.length > 0 ? ifelseState.conditions[0].type : 'AND'
  const [conditionType, setConditionType] = useState(initialConditionType)

  useEffect(() => {
    const updatedExpr = toExpression(ifelseState)
    // TODO: Check args length is 4
    if (
      operation.expression !== updatedExpr &&
      isValidExpression(updatedExpr)
    ) {
      dispatch({
        type: BuilderActionEnum.Update,
        payload: {
          currIndex: index,
          element: { ...operation, expression: updatedExpr },
          configArrName: ConfigArrayEnum.Operations,
        },
      })
    }
  }, [ifelseState, dispatch, index, operation])

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

  const handleExprChange = (name: string, value: string) => {
    setIfelseState((s) =>
      update(s, {
        [name]: { $set: value },
      })
    )
  }

  const updateConditionExpression = (
    i: number,
    condition: Partial<Condition>
  ) => {
    setIfelseState((s) =>
      update(s, {
        conditions: { [i]: { $merge: condition } },
      })
    )
  }

  const updateAllConditionTypes = (conditionType: ConditionType) => {
    // Set conditionType state
    setConditionType(conditionType)

    // Set all condition types in ifElseState
    const updateAllConditionTypes: Record<string, Spec<Condition>> = {}

    ifelseState.conditions.forEach((_condition, conditionIndex) => {
      updateAllConditionTypes[conditionIndex] = {
        type: { $set: conditionType },
      }
    })

    setIfelseState((s) =>
      update(s, {
        conditions: updateAllConditionTypes,
      })
    )
  }

  const addCondition = () => {
    const emptyCondition: Condition = {
      type: conditionType,
      expression: '',
    }

    setIfelseState((s) =>
      update(s, {
        conditions: { $push: [emptyCondition] },
      })
    )
  }

  const deleteCondition = (index: number) => {
    setIfelseState((s) =>
      update(s, {
        conditions: { $splice: [[index, 1]] },
      })
    )
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiGitBranch />}
        />
        <Input
          name="title"
          sx={commonStyles.fieldInput}
          type="text"
          placeholder="Result description"
          onChange={handleChange}
          value={title}
        />
      </InputGroup>
      <HStack sx={styles.inputContainer}>
        <Text sx={styles.inputLabel}>IF</Text>
        <ExpressionInput
          type="text"
          sx={commonStyles.expressionInput}
          name="ifExpr"
          onChange={(expr) => handleExprChange('ifExpr', expr)}
          value={ifelseState.ifExpr}
        />
        <Box sx={styles.deleteSpacer} />
      </HStack>
      {ifelseState.conditions.map((cond, i) => (
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
                  isActive={conditionType === 'AND'}
                  onClick={() => updateAllConditionTypes('AND')}
                >
                  And
                </MenuItem>
                <MenuItem
                  as={Button}
                  variant="ghost"
                  sx={styles.menuItem}
                  isActive={conditionType === 'OR'}
                  onClick={() => updateAllConditionTypes('OR')}
                >
                  Or
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Text sx={styles.spacedInputLabel}>{conditionType}</Text>
          )}
          <ExpressionInput
            type="text"
            sx={commonStyles.expressionInput}
            onChange={(expression) =>
              updateConditionExpression(i, { expression })
            }
            value={cond.expression}
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
        Add New
      </Button>
      <Divider sx={styles.divider} />
      <HStack sx={styles.inputContainer}>
        <Text sx={styles.inputLabel}>THEN</Text>
        <ExpressionInput
          type="text"
          sx={commonStyles.expressionInput}
          name="thenExpr"
          placeholder="Use this field as a ‘true/false’ statement, or show a result"
          onChange={(expr) => handleExprChange('thenExpr', expr)}
          value={ifelseState.thenExpr}
        />
      </HStack>
      <HStack sx={styles.inputContainer}>
        <Text sx={styles.inputLabel}>ELSE</Text>
        <ExpressionInput
          type="text"
          sx={commonStyles.expressionInput}
          name="elseExpr"
          placeholder="Use this field as a ‘true/false’ statement, or show a result"
          onChange={(expr) => handleExprChange('elseExpr', expr)}
          value={ifelseState.elseExpr}
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
      icon={BiGitBranch}
    />
  )
}

export const ConditionalResult = createBuilderField(
  InputComponent,
  PreviewComponent
)
