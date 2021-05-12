import React, { FC, useMemo, useRef } from 'react'
import { findIndex } from 'lodash'
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
import { matchSorter, RankingInfo } from 'match-sorter'

import { useCheckerContext } from '../../../contexts'

type Item = { id: string; type: 'FIELD' | 'OPERATION'; title: string }

interface RankedItem extends RankingInfo {
  item: Item
  index: number
}

/**
 * Represents a single query string within an expression.
 * An expression can contain 0 or more of these blocks, and
 * are meant to be eventually replaced by a checker variable
 */
type QueryBlock = {
  query: string
  pos: number
}

interface ExpressionInputProps extends Omit<InputProps, 'onChange'> {
  onChange: (expression: string) => void
}

export const ExpressionInput: FC<ExpressionInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  const caretPos = useRef<number>(`${value}`.length)
  const inputRef = useRef<HTMLInputElement>(null)

  const { config } = useCheckerContext()
  const items = useMemo<Item[]>(() => {
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
  }, [config.fields, config.operations])

  /**
   * Obtains the currently edited query block based on the user's caret position
   * Query blocks are matched based on the regex `/@([\w\d]+([\s]+[\w\d]+)*|[\w\d]*)/g`
   * Information on the regex can be found at: https://regexr.com/5r4mj
   *
   * @param inputStr the current expression
   * @param caretIndex the index of the caret within the expression
   * @returns the query string and index of the block within the expression
   */
  const getCurrentQueryBlock = (
    inputStr: string | null | undefined,
    caretIndex: number
  ): QueryBlock | null => {
    if (!inputStr) return null
    const queryRegEx = /@([\w\d]+([\s]+[\w\d]+)*|[\w\d]*)/g

    let match: RegExpExecArray | null
    while ((match = queryRegEx.exec(inputStr)) !== null) {
      // query block is only active when caret is to the right of the '@' character,
      // up to the limit of the block as defined by the regex query
      if (caretIndex <= queryRegEx.lastIndex && caretIndex > match.index) {
        return { query: match[0].substring(1), pos: match.index }
      }
    }

    return null
  }

  const replaceVariableName = (
    inputStr: string | null,
    variableName?: string | null
  ): string => {
    const queryBlock = getCurrentQueryBlock(inputStr, caretPos.current)
    if (inputStr && queryBlock) {
      const replaceStart = queryBlock.pos
      // increment query length by 1 to account for the removed '@' character
      const replaceEnd = queryBlock.pos + (queryBlock.query.length + 1)

      // update cursor to after replaced variable
      caretPos.current = replaceStart + (variableName?.length || 0)

      return (
        inputStr.slice(0, replaceStart) +
        (variableName || '') +
        inputStr.slice(replaceEnd)
      )
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
        return {
          ...changes,
          inputValue: replaceVariableName(
            state?.inputValue,
            changes?.inputValue
          ),
        }
      case Downshift.stateChangeTypes.changeInput:
        return {
          ...changes,
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

  // The baseSort function is used to tie-break items that have the same ranking.
  // This is useful in two main cases:
  // - when the user types `@ `, we want to display all reference options on the Questions tab followed by the Logic tab; these reference options should be sorted according to their position on their respective tabs.
  // - when the user types `@ <query>` and there are multiple reference options with titles that exactly match `<query>`, we want to sort these reference options according to their position on their Questions tab followed by the Logic tab.
  const baseSort = (
    { item: a }: RankedItem,
    { item: b }: RankedItem
  ): number => {
    const itemAIndex = findIndex<Item>(items, (item) => item.id === a.id)
    const itemBIndex = findIndex<Item>(items, (item) => item.id === b.id)
    return itemAIndex < itemBIndex ? -1 : 1
  }

  return (
    <Downshift
      initialInputValue={`${value}`}
      stateReducer={stateReducer}
      onSelect={() => {
        // updates the cursor after onSelect is triggered
        inputRef.current?.setSelectionRange(caretPos.current, caretPos.current)
      }}
      onStateChange={(_, state) => {
        onChange(state.inputValue || '')
      }}
      itemToString={(item) => item?.id || ''}
    >
      {({
        getRootProps,
        getMenuProps,
        getInputProps,
        getItemProps,
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
            ref={inputRef}
            {...getInputProps({
              ...props,
              onChange: (e: React.FormEvent<HTMLInputElement>) => {
                caretPos.current = e.currentTarget.selectionStart || -1
              },
            })}
          />
          {getCurrentQueryBlock(inputValue, caretPos.current) !== null ? (
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
              {matchSorter(
                items,
                getCurrentQueryBlock(inputValue, caretPos.current)?.query || '',
                {
                  keys: ['id', 'title'],
                  baseSort,
                }
              ).map((item, index) => (
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
