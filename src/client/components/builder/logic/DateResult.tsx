import React, { useEffect, useState } from 'react'
import { isValidExpression } from '../../../core/evaluator'
import { BiCalendar, BiChevronDown } from 'react-icons/bi'
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { FormulaPreview } from './FormulaPreview'
import update from 'immutability-helper'

interface DateState {
  variableId: string
  isAdd: boolean
  numberOfIntervals: number
}

const EMPTY_STATE: DateState = {
  variableId: '',
  isAdd: true,
  numberOfIntervals: 0,
}

// TODO: Make more rigorous to include other time units
const fromExpression = (expression: string): DateState => {
  const splitExpression = expression.split(' ')
  // eg. splitExpression = [ 'D1', '+', '14', 'days' ]

  if (splitExpression.length === 4) {
    return {
      variableId: splitExpression[0],
      isAdd: splitExpression[1] === '+',
      numberOfIntervals: Number(splitExpression[2]),
    }
  }

  return EMPTY_STATE
}

const toExpression = (state: DateState): string => {
  const { variableId, isAdd, numberOfIntervals } = state
  return `${variableId} ${isAdd ? '+' : '-'} ${numberOfIntervals} days`
}

const InputComponent: OperationFieldComponent = ({ operation, index }) => {
  const { title, expression, id: currentId } = operation
  const { config, dispatch } = useCheckerContext()
  const [dateState, setDateState] = useState<DateState>(
    fromExpression(expression)
  )

  useEffect(() => {
    const updatedExpression = toExpression(dateState)
    if (
      operation.expression !== updatedExpression &&
      isValidExpression(updatedExpression)
    ) {
      dispatch({
        type: BuilderActionEnum.Update,
        payload: {
          currIndex: index,
          element: { ...operation, expression: updatedExpression },
          configArrName: ConfigArrayEnum.Operations,
        },
      })
    }
  }, [dateState, dispatch, index, operation])

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

  const updateState = (name: string, value: string | boolean | number) => {
    setDateState((s) =>
      update(s, {
        [name]: { $set: value },
      })
    )
  }

  return (
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiCalendar />
      </Box>
      <VStack align="stretch" w="100%">
        <Input
          name="title"
          type="text"
          placeholder="Operation title"
          onChange={handleChange}
          value={title}
        />
        <HStack>
          <Menu>
            <MenuButton as={Button} rightIcon={<BiChevronDown />}>
              {dateState.variableId ? dateState.variableId : 'SELECT INPUT'}
            </MenuButton>
            <MenuList>
              {config.fields
                .filter(({ type }) => type === 'DATE')
                .map(({ id, title }, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => updateState('variableId', id)}
                  >
                    <HStack spacing={4}>
                      <Badge
                        bg="error.500"
                        color="white"
                        fontSize="sm"
                        borderRadius="5px"
                      >
                        {id}
                      </Badge>
                      <Text isTruncated>{title}</Text>
                    </HStack>
                  </MenuItem>
                ))}
              {config.operations
                .filter(({ id, type }) => type === 'DATE' && id !== currentId)
                .map(({ id, title }, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => updateState('variableId', id)}
                  >
                    <HStack spacing={4}>
                      <Badge
                        bg="success.500"
                        color="white"
                        fontSize="sm"
                        borderRadius="5px"
                      >
                        {id}
                      </Badge>
                      <Text isTruncated>{title}</Text>
                    </HStack>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<BiChevronDown />}>
              {dateState.isAdd ? '+' : '-'}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => updateState('isAdd', true)}>+</MenuItem>
              <MenuItem onClick={() => updateState('isAdd', false)}>-</MenuItem>
            </MenuList>
          </Menu>
          <NumberInput
            precision={0}
            step={1}
            min={0}
            defaultValue={
              dateState.numberOfIntervals && dateState.numberOfIntervals
            }
            onChange={(value) => updateState('numberOfIntervals', value)}
          >
            <NumberInputField placeholder="Number" />
          </NumberInput>
          <Text>days</Text>
        </HStack>
      </VStack>
    </HStack>
  )
}

const PreviewComponent: OperationFieldComponent = ({ operation }) => {
  const { show, title, expression } = operation
  return (
    <FormulaPreview
      show={show}
      title={title}
      expression={expression}
      icon={BiCalendar}
    />
  )
}

export const DateResult = createBuilderField(InputComponent, PreviewComponent)
