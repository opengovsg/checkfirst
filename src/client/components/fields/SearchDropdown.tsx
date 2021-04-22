import {
  HStack,
  Input,
  ListItem,
  InputProps,
  UnorderedList,
  VStack,
  Text,
} from '@chakra-ui/react'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { matchSorter } from 'match-sorter'
import React, { FC, Ref, useMemo } from 'react'
import { FieldOption } from '../../../types/checker'

type SearchDropdownItem = {
  value: string
  label: string
}

interface SearchDropdownProps extends Omit<InputProps, 'onChange'> {
  options: FieldOption[]
  ref: Ref<HTMLInputElement>
  onChange: (value: string) => void
}

export const SearchDropdown: FC<SearchDropdownProps> = ({
  value,
  onChange,
  options,
  ref,
  ...props
}) => {
  const items = useMemo<SearchDropdownItem[]>(() => {
    const items: SearchDropdownItem[] = options.map((option) => ({
      value: `${option.value}`,
      label: option.label,
    }))

    return items
  }, [options])

  const inputIsWithinOptions = (input: string) => {
    return items.filter((item) => {
      if (item.label.includes(input)) {
        return item
      }
    }).length > 0
      ? true
      : false
  }

  const stateReducer = (
    state: DownshiftState<SearchDropdownItem>,
    changes: StateChangeOptions<SearchDropdownItem>
  ) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.mouseUp:
        // Prevent blur from resetting inputValue
        if (!changes.inputValue) {
          return {
            ...changes,
            inputValue: state.selectedItem?.value || `${value}`,
          }
        }
    }
    return changes
  }

  return (
    <Downshift
      initialInputValue={`${value}`}
      initialSelectedItem={items.find((item) => {
        item.value === value
      })}
      stateReducer={stateReducer}
      itemToString={(item) => item?.label || ''}
      onChange={(item) => {
        if (item) {
          onChange(item.value)
        }
      }}
      defaultHighlightedIndex={0}
    >
      {({
        getRootProps,
        getMenuProps,
        getInputProps,
        getItemProps,
        inputValue,
        highlightedIndex,
        isOpen,
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
              ref: ref,
            })}
          />
          {isOpen && inputIsWithinOptions(inputValue || '') ? (
            <UnorderedList
              {...getMenuProps()}
              listStyleType="none"
              border="solid 1px #E2E8F0"
              borderBottomRadius="6px"
              overflowY="auto"
              position="absolute"
              top="40px"
              bg="white"
              w="100%"
              zIndex={99}
            >
              {matchSorter(items, inputValue || '', {
                keys: ['label'],
              }).map((item, index) => (
                <ListItem
                  {...getItemProps({ key: index, item })}
                  bg={highlightedIndex === index ? 'neutral.50' : 'none'}
                  py={2}
                  px={2}
                >
                  <HStack spacing={4}>
                    <Text isTruncated>{item.label}</Text>
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
