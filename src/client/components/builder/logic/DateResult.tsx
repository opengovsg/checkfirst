import React, { useState } from 'react'
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
import { ExpressionInput } from './ExpressionInput'

interface DateState {
  variableId: string
}

const EMPTY_STATE: DateState = {
  variableId: '',
}

const InputComponent: OperationFieldComponent = ({ operation, index }) => {
  const { title, expression } = operation
  const { config, dispatch } = useCheckerContext()
  const [dateState, setDateState] = useState<DateState>(EMPTY_STATE)

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
        <ExpressionInput
          name="expression"
          type="text"
          placeholder="Enter expression"
          bg="#F4F6F9"
          fontFamily="mono"
          value={expression}
          onChange={(expression) =>
            handleExpressionChange('expression', expression)
          }
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
                    // onClick={() => handleExprChange('variableId', id)}
                    onClick={() => setDateState({ variableId: id })}
                  >
                    <HStack spacing={4}>
                      <Badge
                        bg="#FB5D64"
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
                .filter(({ type }) => type === 'DATE')
                .map(({ id, title }, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => setDateState({ variableId: id })}
                  >
                    <HStack spacing={4}>
                      <Badge
                        bg="#46DBC9"
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
              +
            </MenuButton>
            <MenuList>
              <MenuItem>+</MenuItem>
              <MenuItem>-</MenuItem>
            </MenuList>
          </Menu>
          <NumberInput>
            <NumberInputField />
          </NumberInput>
          <Text>days</Text>
        </HStack>
      </VStack>
    </HStack>
  )
}

const PreviewComponent: OperationFieldComponent = ({ operation }) => {
  const { title, expression } = operation
  return (
    <VStack align="stretch" w="50%" spacing={4}>
      <HStack>
        <BiCalendar fontSize="20px" />
        <Text>{title}</Text>
      </HStack>
      <Text fontFamily="mono">{expression}</Text>
    </VStack>
  )
}

export const DateResult = createBuilderField(InputComponent, PreviewComponent)
