import React, { FC } from 'react'
import {
  HStack,
  VStack,
  UnorderedList,
  ListItem,
  Input,
  InputProps,
  Text,
  Badge,
} from '@chakra-ui/react'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { matchSorter } from 'match-sorter'

import { useCheckerContext } from '../../../contexts'

type Item = { id: string; type: 'FIELD' | 'OPERATION'; title: string }

interface ExpressionInputProps extends Omit<InputProps, 'onChange'> {
  onChange: (expression: string) => void
}

export const ExpressionInput: FC<ExpressionInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  const { config } = useCheckerContext()

  const getItems = (): Item[] => {
    let items: Item[] = []
    items = items.concat(
      config.fields.map(({ id, title }) => ({
        id: id,
        type: 'FIELD',
        title: title,
      }))
    )

    items = items.concat(
      config.operations.map(({ id, title }) => ({
        id: id,
        type: 'OPERATION',
        title: title,
      }))
    )

    return items
  }

  const getQueryString = (input?: string | null) => {
    if (!input) return ''

    // We only support queries when there is one @ in the expression
    const first = input.indexOf('@')
    const last = input.lastIndexOf('@')
    if (first > -1 && last > -1 && first === last) {
      return input.substring(first + 1)
    }

    return ''
  }

  const replaceVariableName = (
    inputStr: string | null,
    variableName?: string | null
  ): string => {
    const queryString = getQueryString(inputStr)
    if (queryString && inputStr) {
      return inputStr.replace('@' + queryString, variableName || '')
    }

    return inputStr || ''
  }

  const stateReducer = (
    state: DownshiftState<Item>,
    changes: StateChangeOptions<Item>
  ) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.clickItem:
      case Downshift.stateChangeTypes.keyDownEnter:
        onChange(replaceVariableName(state?.inputValue, changes?.inputValue))
        return {
          ...changes,
          inputValue: replaceVariableName(
            state?.inputValue,
            changes.inputValue
          ),
        }
      case Downshift.stateChangeTypes.changeInput:
        onChange(changes.inputValue || '')
        return {
          ...changes,
          isOpen: getQueryString(changes.inputValue) !== '',
        }
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.mouseUp:
        // Prevent blur from resetting inputValue
        return {
          ...changes,
          inputValue: state.inputValue,
        }
    }
    return changes
  }

  return (
    <Downshift
      initialInputValue={`${value}`}
      stateReducer={stateReducer}
      itemToString={(item) => item?.id || ''}
    >
      {({
        getRootProps,
        getMenuProps,
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        highlightedIndex,
      }) => (
        <VStack
          {...getRootProps()}
          align="stretch"
          spacing={0}
          position="relative"
          flex={1}
        >
          <Input
            {...getInputProps({
              ...props,
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === '@') {
                  // TODO: Store the existing input value into buffer so we can
                  // replace it later on select
                }
              },
            })}
          />
          {isOpen ? (
            <UnorderedList
              {...getMenuProps()}
              listStyleType="none"
              border="solid 1px #E2E8F0"
              borderBottomRadius="6px"
              maxH="200px"
              overflowY="auto"
              position="absolute"
              top="40px"
              bg="white"
              w="100%"
              zIndex={99}
            >
              {matchSorter(getItems(), getQueryString(inputValue), {
                keys: ['id', 'title'],
              }).map((item, index) => (
                <ListItem
                  {...getItemProps({ key: index, item })}
                  bg={highlightedIndex === index ? 'neutral.50' : 'none'}
                  py={2}
                  px={2}
                >
                  <HStack spacing={4}>
                    <Badge
                      bg={item.type === 'FIELD' ? '#FB5D64' : '#46DBC9'}
                      color="white"
                      fontSize="sm"
                      borderRadius="5px"
                    >
                      {item.id}
                    </Badge>
                    <Text isTruncated>{item.title}</Text>
                  </HStack>
                </ListItem>
              ))}
            </UnorderedList>
          ) : null}
        </VStack>
      )}
    </Downshift>
  )
}
