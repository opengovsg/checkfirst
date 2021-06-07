import React, { useEffect, useState } from 'react'
import { isValidExpression } from '../../../core/evaluator'
import { BiCalendar, BiChevronDown } from 'react-icons/bi'
import {
  VStack,
  HStack,
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
  InputGroup,
  InputLeftElement,
  useStyles,
  useMultiStyleConfig,
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

  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('DateResult', {})

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

  const renderBadgeWithTitle = (
    id: string,
    title: string,
    badgeCol: string
  ) => (
    <HStack sx={styles.menuRowContainer} spacing={4}>
      <Badge sx={styles.menuRowBadge} bg={badgeCol}>
        {id}
      </Badge>
      <Text isTruncated>{title}</Text>
    </HStack>
  )

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiCalendar />}
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
      <HStack sx={styles.dateContainer} spacing={4}>
        <Menu matchWidth>
          <MenuButton
            as={Button}
            sx={styles.questionButton}
            variant="outline"
            rightIcon={<BiChevronDown />}
          >
            <Text
              sx={styles.menuButtonText}
              textColor={dateState.variableId ? 'secondary.700' : 'neutral.500'}
            >
              {dateState.variableId ? dateState.variableId : 'Select question'}
            </Text>
          </MenuButton>
          <MenuList>
            {config.fields
              .filter(({ type }) => type === 'DATE')
              .map(({ id, title }, i) => (
                <MenuItem key={i} onClick={() => updateState('variableId', id)}>
                  {renderBadgeWithTitle(id, title, 'success.500')}
                </MenuItem>
              ))}
            {config.operations
              .filter(({ id, type }) => type === 'DATE' && id !== currentId)
              .map(({ id, title }, i) => (
                <MenuItem key={i} onClick={() => updateState('variableId', id)}>
                  {renderBadgeWithTitle(id, title, 'primary.500')}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
        <Menu matchWidth>
          <MenuButton
            as={Button}
            sx={styles.operatorButton}
            variant="outline"
            rightIcon={<BiChevronDown />}
          >
            <Text sx={styles.menuButtonText}>
              {dateState.isAdd ? '+' : '-'}
            </Text>
          </MenuButton>
          <MenuList sx={styles.operatorMenuList}>
            <MenuItem onClick={() => updateState('isAdd', true)}>+</MenuItem>
            <MenuItem onClick={() => updateState('isAdd', false)}>-</MenuItem>
          </MenuList>
        </Menu>
        <NumberInput
          sx={styles.numberInput}
          precision={0}
          step={1}
          min={0}
          defaultValue={dateState.numberOfIntervals || undefined}
          onChange={(value) => updateState('numberOfIntervals', value)}
        >
          <NumberInputField sx={styles.numberField} placeholder="Number" />
        </NumberInput>
        <Text sx={styles.daysText}>DAYS</Text>
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
      icon={BiCalendar}
    />
  )
}

export const DateResult = createBuilderField(InputComponent, PreviewComponent)
