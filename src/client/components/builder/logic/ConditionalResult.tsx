import React, { useState, useEffect } from 'react'
import update from 'immutability-helper'
import { BiGitBranch, BiPlusCircle, BiTrash } from 'react-icons/bi'
import {
  Divider,
  Button,
  IconButton,
  VStack,
  HStack,
  Box,
  Text,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'

interface Condition {
  type: 'AND' | 'OR'
  expression: string
}

interface IfelseState {
  ifExpr: string
  conditions: Condition[]
  elseExpr: string
  thenExpr: string
}

const EMPTY_STATE: IfelseState = {
  ifExpr: '',
  conditions: [],
  elseExpr: '',
  thenExpr: '',
}

const fromExpression = (expression: string): IfelseState => {
  const matches = expression.match(/ifelse\((.*?), (.*?), (.*?)\)/)
  if (matches) {
    const { 1: conditionExpr, 2: thenExpr, 3: elseExpr } = matches
    // TODO: This is the not the most robust method to tokenize the string.
    // This will fail if there are nested AND/OR in sub-expressions.
    const parts = conditionExpr.replace(/\b(and|or)\b/g, '#$1').split('#')

    const conditions = parts.slice(1).map((p) => {
      const partMatch = p.match(/\b(and|or)\b\s\((.*?)\)/)
      if (!partMatch) throw new Error('Invalid expression')

      const { 1: boolOperator, 2: subExpr } = partMatch
      return {
        type: boolOperator.toUpperCase(),
        expression: subExpr,
      } as Condition
    })

    return {
      ifExpr: parts[0],
      conditions,
      elseExpr,
      thenExpr,
    }
  }

  return EMPTY_STATE
}

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
  const { description, expression } = operation
  const { dispatch } = useCheckerContext()
  const [ifelseState, setIfelseState] = useState<IfelseState>(
    fromExpression(expression)
  )

  useEffect(() => {
    const updatedExpr = toExpression(ifelseState)
    if (operation.expression !== updatedExpr) {
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

  const handleExprChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setIfelseState((s) =>
      update(s, {
        [name]: { $set: value },
      })
    )
  }

  const updateCondition = (i: number, condition: Partial<Condition>) => {
    setIfelseState((s) =>
      update(s, {
        conditions: { [i]: { $merge: condition } },
      })
    )
  }

  const addCondition = () => {
    const emptyCondition: Condition = {
      type: 'AND',
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
    <VStack w="100%" align="stretch" spacing={6}>
      <HStack w="100%" alignItems="flex-start">
        <Box fontSize="20px" pt={2}>
          <BiGitBranch />
        </Box>
        <Input
          name="description"
          type="text"
          placeholder="Result description"
          onChange={handleChange}
          value={description}
        />
      </HStack>
      <VStack align="stretch" spacing={4}>
        <HStack>
          <Box w="100px">
            <Button variant="ghost">IF</Button>
          </Box>
          <Input
            bg="#F4F6F9"
            type="text"
            name="ifExpr"
            fontFamily="mono"
            onChange={handleExprChange}
            value={ifelseState.ifExpr}
          />
          <HStack>
            <IconButton
              variant="ghost"
              aria-label="Add condition"
              fontSize="20px"
              onClick={addCondition}
              icon={<BiPlusCircle />}
            />
          </HStack>
        </HStack>
        {ifelseState.conditions.map((cond, i) => (
          <HStack key={i}>
            <Menu>
              <Box w="100px">
                <MenuButton as={Button} variant="ghost">
                  {cond.type}
                </MenuButton>
              </Box>
              <MenuList>
                <MenuItem onClick={() => updateCondition(i, { type: 'AND' })}>
                  AND
                </MenuItem>
                <MenuItem onClick={() => updateCondition(i, { type: 'OR' })}>
                  OR
                </MenuItem>
              </MenuList>
            </Menu>
            <Input
              bg="#F4F6F9"
              type="text"
              fontFamily="mono"
              onChange={({ target: { value } }) =>
                updateCondition(i, { expression: value })
              }
              value={cond.expression}
            />
            <HStack>
              <IconButton
                variant="ghost"
                aria-label="Delete condition"
                fontSize="20px"
                onClick={() => deleteCondition(i)}
                icon={<BiTrash />}
              />
              <IconButton
                variant="ghost"
                aria-label="Add condition"
                fontSize="20px"
                onClick={addCondition}
                icon={<BiPlusCircle />}
              />
            </HStack>
          </HStack>
        ))}
      </VStack>
      <Divider />
      <VStack align="stretch" spacing={4}>
        <HStack>
          <Box w="100px">
            <Button w="100%" variant="ghost">
              THEN
            </Button>
          </Box>
          <Input
            bg="#F4F6F9"
            type="text"
            name="thenExpr"
            fontFamily="mono"
            onChange={handleExprChange}
            value={ifelseState.thenExpr}
          />
        </HStack>
        <HStack>
          <Box w="100px">
            <Button w="100%" variant="ghost">
              ELSE
            </Button>
          </Box>
          <Input
            bg="#F4F6F9"
            type="text"
            name="elseExpr"
            fontFamily="mono"
            onChange={handleExprChange}
            value={ifelseState.elseExpr}
          />
        </HStack>
      </VStack>
    </VStack>
  )
}

const PreviewComponent: OperationFieldComponent = ({ operation }) => {
  const { description, expression } = operation
  return (
    <VStack align="stretch" w="100%" spacing={4}>
      <HStack>
        <BiGitBranch fontSize="20px" />
        <Text>{description}</Text>
      </HStack>
      <Text fontFamily="mono">{expression}</Text>
    </VStack>
  )
}

export const ConditionalResult = createBuilderField(
  InputComponent,
  PreviewComponent
)
