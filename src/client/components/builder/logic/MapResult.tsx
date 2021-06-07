import React, { useState, useEffect } from 'react'
import { isValidExpression, math } from '../../../core/evaluator'
import update from 'immutability-helper'
import { BiGitCompare, BiChevronDown } from 'react-icons/bi'
import {
  Badge,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  useStyles,
  useMultiStyleConfig,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { FormulaPreview } from './FormulaPreview'

interface MapState {
  tableId: string
  variableId: string
}

const EMPTY_STATE: MapState = {
  tableId: '',
  variableId: '',
}

const fromExpression = (expression: string) => {
  const root = math.parse!(expression)
  const args: string[] = []
  root.forEach((node) => args.push(node.toString()))

  if (root.isAccessorNode && args.length === 2) {
    return {
      tableId: args[0],
      variableId: args[1].slice(1, -1),
    }
  }

  return EMPTY_STATE
}

const toExpression = (state: MapState): string => {
  const { variableId, tableId } = state

  // Set a valid expression if the mapState isn't properly defined
  if (!variableId || !tableId) {
    return '0'
  } else {
    return `${tableId}[${variableId}]`
  }
}

const InputComponent: OperationFieldComponent = ({ operation, index }) => {
  const { title, expression } = operation
  const { config, dispatch } = useCheckerContext()
  const [mapState, setMapState] = useState<MapState>(fromExpression(expression))

  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('MapResult', {})

  useEffect(() => {
    const updatedExpr = toExpression(mapState)
    // TODO: Check args length is 2
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
  }, [mapState, dispatch, index, operation])

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
    setMapState((s) =>
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
          children={<BiGitCompare />}
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
      <HStack sx={styles.mapContainer} spacing={4}>
        <Text sx={styles.mapText}>MAP</Text>
        <Menu matchWidth preventOverflow={false}>
          <MenuButton
            as={Button}
            sx={styles.menuButton}
            variant="outline"
            rightIcon={<BiChevronDown />}
          >
            <Text
              sx={styles.menuButtonText}
              textColor={mapState.variableId ? 'secondary.700' : 'neutral.500'}
            >
              {mapState.variableId ? mapState.variableId : 'Select question'}
            </Text>
          </MenuButton>
          <MenuList sx={styles.menuList}>
            {config.fields.map(({ id, title }, i) => (
              <MenuItem
                key={i}
                onClick={() => handleExprChange('variableId', id)}
              >
                {renderBadgeWithTitle(id, title, 'error.500')}
              </MenuItem>
            ))}
            {config.operations.map(({ id, title }, i) => (
              <MenuItem
                key={i}
                onClick={() => handleExprChange('variableId', id)}
              >
                {renderBadgeWithTitle(id, title, 'success.500')}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Text sx={styles.toText}>TO</Text>
        <Menu matchWidth>
          <MenuButton
            as={Button}
            sx={styles.menuButton}
            variant="outline"
            rightIcon={<BiChevronDown />}
          >
            <Text
              sx={styles.menuButtonText}
              textColor={mapState.tableId ? 'secondary.700' : 'neutral.500'}
            >
              {mapState.tableId ? mapState.tableId : 'Select constant table'}
            </Text>
          </MenuButton>
          <MenuList sx={styles.menuList}>
            {config.constants.map(({ id, title }, i) => (
              <MenuItem key={i} onClick={() => handleExprChange('tableId', id)}>
                {renderBadgeWithTitle(id, title, 'warning.500')}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
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
      icon={BiGitCompare}
    />
  )
}

export const MapResult = createBuilderField(InputComponent, PreviewComponent)
