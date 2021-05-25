import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Badge,
  HStack,
  Input,
  InputProps,
  ListItem,
  UnorderedList,
  VStack,
  Text,
} from '@chakra-ui/react'
import { matchSorter, RankingInfo } from 'match-sorter'

import Downshift from 'downshift'

import { useCheckerContext } from '../../../contexts'
import { findIndex } from 'lodash'
import { CalculatorBar } from './CalculatorBar'

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

interface ExpressionInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  onChange: (expr: string) => void
  value: string
}

export const ExpressionInput: FC<ExpressionInputProps> = ({
  onChange,
  value,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>(value)
  const [showCalcBar, setShowCalcBar] = useState(false)
  const [selection, setSelection] = useState<{ start: number; end: number }>()

  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // syncs input value with subsequent value updates
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // syncs value updates to input value updates
  useEffect(() => {
    onChange(inputValue)

    // avoid specifying onChange as a dependency, as it will lead to an infinite
    // update loop!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])

  // sets the selection range on render, as it won't work before commit phase
  useLayoutEffect(() => {
    if (selection) {
      inputRef.current?.setSelectionRange(selection.start, selection.end)
    }
  }, [selection, inputRef])

  // hide calc bar when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowCalcBar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // load query replacement items from checker context
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
    inputStr: string | null,
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

  /**
   * Gets all items that matches the current query being edited
   * @returns The list of matching items, or null if there are no matches or no query block being edited
   */
  const getCurrentQueryMatches = () => {
    const currentQueryBlock = getCurrentQueryBlock(
      inputValue,
      selection?.start || 0
    )

    if (currentQueryBlock) {
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

      const matches = matchSorter(items, currentQueryBlock?.query || '', {
        keys: ['id', 'title'],
        baseSort,
      })

      return matches.length > 0 ? matches : null
    }

    return null
  }

  const replaceVariableName = (
    inputStr: string | null,
    variableName?: string | null
  ): string => {
    const queryBlock = getCurrentQueryBlock(inputStr, selection?.start || 0)
    if (inputStr && queryBlock) {
      const replaceStart = queryBlock.pos
      // increment query length by 1 to account for the removed '@' character
      const replaceEnd = queryBlock.pos + (queryBlock.query.length + 1)

      // update cursor to after replaced variable
      const newCaretPos = replaceStart + (variableName?.length || 0)
      setSelection({ start: newCaretPos, end: newCaretPos })

      return (
        inputStr.slice(0, replaceStart) +
        (variableName || '') +
        inputStr.slice(replaceEnd)
      )
    }

    return inputStr || ''
  }

  const handleCalculatorChange = (operand: string) => {
    setInputValue((oldVal) => {
      return (
        oldVal.slice(undefined, selection?.start) +
        operand +
        oldVal.slice(selection?.end)
      )
    })
    setSelection((oldSel) => {
      if (!oldSel) return undefined

      const newPos = oldSel.end + operand.length
      return {
        start: newPos,
        end: newPos,
      }
    })
    inputRef.current?.focus()
    setShowCalcBar(true)
  }

  const currentMatches = getCurrentQueryMatches()

  return (
    <VStack align="stretch" position="relative" flex={1} w={0} ref={wrapperRef}>
      <Downshift
        // controlled values
        inputValue={inputValue}
        isOpen={!!currentMatches}
        // item aria-label converter
        itemToString={(item) => item?.id || ''}
        // default values
        defaultHighlightedIndex={0}
        defaultIsOpen={false}
        // event handlers
        onSelect={(item) => {
          if (item) {
            setInputValue(replaceVariableName(inputValue, item.id))
          }
        }}
      >
        {({
          isOpen,
          inputValue,
          getRootProps,
          getMenuProps,
          getInputProps,
          getItemProps,
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
              })}
              value={inputValue || ''}
              ref={inputRef}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              onSelect={(e) => {
                const start = e.currentTarget.selectionStart || 0
                const end = e.currentTarget.selectionEnd || 0
                setSelection({ start: start, end: end })
              }}
              onFocus={() => setShowCalcBar(true)}
            />
            <UnorderedList
              {...getMenuProps()}
              listStyleType="none"
              border={isOpen ? 'solid 1px #E2E8F0' : 0}
              borderBottomRadius="6px"
              maxH="200px"
              overflowY="auto"
              position="absolute"
              top="40px"
              bg="white"
              w="100%"
              zIndex={99}
            >
              {isOpen
                ? currentMatches?.map((item, index) => (
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
                  ))
                : null}
            </UnorderedList>
          </VStack>
        )}
      </Downshift>
      {showCalcBar ? (
        <CalculatorBar
          minH="48px"
          backgroundColor="#F4F6F9"
          borderRadius="6px"
          border="solid 1px #DADCE3"
          padding="3px 16px"
          flexWrap="wrap"
          onClick={handleCalculatorChange}
        />
      ) : null}
    </VStack>
  )
}
