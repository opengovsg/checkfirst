import React, { useState, useEffect } from 'react'
import { isValidExpression, math } from '../../../core/evaluator'
import update from 'immutability-helper'
import { BiGitCompare, BiChevronDown } from 'react-icons/bi'
import {
  Badge,
  Button,
  Heading,
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

  return (
    <VStack w="100%" align="stretch" spacing={6}>
      <HStack w="100%" alignItems="flex-start">
        <Box fontSize="20px" pt={2}>
          <BiGitCompare />
        </Box>
        <Input
          name="title"
          type="text"
          placeholder="Result description"
          onChange={handleChange}
          value={title}
        />
      </HStack>
      <VStack align="stretch" spacing={4}>
        <HStack>
          <Box w="100px" pl={8}>
            <Heading as="h5" size="sm">
              MAP
            </Heading>
          </Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={<BiChevronDown />}
            >
              {mapState.variableId ? mapState.variableId : 'SELECT INPUT'}
            </MenuButton>
            <MenuList>
              {config.fields.map(({ id, title }, i) => (
                <MenuItem
                  key={i}
                  onClick={() => handleExprChange('variableId', id)}
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
              {config.operations.map(({ id, title }, i) => (
                <MenuItem
                  key={i}
                  onClick={() => handleExprChange('variableId', id)}
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
        </HStack>
        <HStack>
          <Box w="100px" pl={8}>
            <Heading as="h5" size="sm">
              TO
            </Heading>
          </Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={<BiChevronDown />}
            >
              {mapState.tableId ? mapState.tableId : 'SELECT MAP TABLE'}
            </MenuButton>
            <MenuList>
              {config.constants.map(({ id, title }, i) => (
                <MenuItem
                  key={i}
                  onClick={() => handleExprChange('tableId', id)}
                >
                  <HStack spacing={4}>
                    <Badge
                      bg="primary.500"
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
        </HStack>
      </VStack>
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
