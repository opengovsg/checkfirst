import {
  HStack,
  Input,
  ListItem,
  InputProps,
  VStack,
  Text,
  InputRightElement,
  InputGroup,
  IconButton,
  Box,
  forwardRef,
} from '@chakra-ui/react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import Downshift, {
  DownshiftState,
  GetItemPropsOptions,
  StateChangeOptions,
} from 'downshift'
import { matchSorter, MatchSorterOptions } from 'match-sorter'
import React, { FC, RefCallback, useRef, useState } from 'react'
import { BiChevronDown, BiX } from 'react-icons/bi'
import { FieldOption } from '../../../types/checker'

enum DropdownDirection {
  up,
  down,
}

export interface ComboboxItem {
  label: string
  value: unknown
}

interface ItemRendererProps extends Omit<ListChildComponentProps, 'data'> {
  data: {
    items: ComboboxItem[]
    highlightedIndex: number
    selectedItem: FieldOption
    topDropdownInset: number
    getItemProps: (options: GetItemPropsOptions<ComboboxItem>) => unknown
  }
}

/**
 * Renders a single dropdown item.
 *
 * Used by react-window's `FixedSizeList` to efficiently render
 * large lists. This helps reduce the performance impact of
 * Downshift's event re-renders.
 *
 * @param props Props passed in by the `FixedSizeList` pure component.
 *
 * @returns A list item to be displayed in the dropdown
 */
const ItemRenderer: FC<ItemRendererProps> = (props) => {
  const { items, getItemProps, highlightedIndex, topDropdownInset } = props.data
  const item = items[props.index]

  return (
    <>
      <ListItem
        {...getItemProps({
          style: {
            ...props.style,
            // purely for adding padding insets to FixedStyleList
            // see https://codesandbox.io/s/react-window-list-padding-dg0pq
            top: `${parseFloat(`${props.style.top}`) + topDropdownInset}px`,
            listStyle: 'none',
          },
          item,
          index: props.index,
        })}
        bg={highlightedIndex === props.index ? 'neutral.50' : 'none'}
        py={'12px'}
        px={'20px'}
      >
        <HStack spacing={4}>
          <Text isTruncated>{item.label}</Text>
        </HStack>
      </ListItem>
    </>
  )
}

interface ComboboxProps extends Omit<InputProps, 'onChange' | 'label'> {
  items: ComboboxItem[]
  label: string
  dropdownOptions?: {
    height?: number
    itemHeight?: number
    inset?: number
    dropupThreshold?: number
  }
  searchOptions?: MatchSorterOptions<ComboboxItem>
  inputOptions?: {
    forwardRef?: RefCallback<HTMLInputElement>
    useClearButton?: boolean
  }
  onChange: (value: unknown) => void
}

/**
 * Renders a combobox dropdown.
 *
 * @param items The items to render within the dropdown.
 * @param dropdownOptions Configuration options for rendering the dropdown.
 * @param searchOptions Configuration options for `matchSorter` to use when searching
 * through the dropdown based on the user input.
 * @param inputOptions Configuration options for rendering the combobox input.
 * @returns A combobox element
 */
export const Combobox: FC<ComboboxProps> = ({
  items,
  label,
  dropdownOptions,
  searchOptions,
  inputOptions,
  onChange,
  ...props
}) => {
  let input: HTMLInputElement
  const inputRef = (instance: HTMLInputElement) => {
    if (instance) {
      input = instance

      if (inputOptions?.forwardRef) {
        inputOptions?.forwardRef(instance)
      }
    }
  }

  const dropdownHeight = dropdownOptions?.height || 200
  const itemHeight = dropdownOptions?.itemHeight || 40
  const dropdownInset = dropdownOptions?.inset || 0

  const dropdownListRef = useRef<FixedSizeList & HTMLElement>(null)
  const [searchResults, setSearchResults] = useState<ComboboxItem[]>(items)
  const [dropdownDir, setDropdownDir] = useState<DropdownDirection>(
    DropdownDirection.down
  )

  /**
   * Calculates and returns array of the the items with the
   * closest matching labels to the inputValue
   *
   * @param inputValue The user query to search the dropdown with.
   * @returns An array of all matching items.
   */
  const updateSearchResults = (inputValue: string) => {
    const newResults = matchSorter(items, inputValue, {
      keys: ['label'],
      threshold: searchOptions?.threshold || matchSorter.rankings.CONTAINS,
      ...searchOptions,
    })

    setSearchResults(newResults)
  }

  /**
   * Calculates the height of the dropdown at any given time given
   * the number of items in the dropdown.
   *
   * @param itemsLength The number of items in the dropdown
   * @returns The height of the dropdown in pixels
   */
  const getDropdownHeight = (itemsLength: number) => {
    // remove dropdown inset from dropdownHeight to avoid double additions
    return itemsLength > 0
      ? Math.min(dropdownHeight - dropdownInset * 2, itemsLength * itemHeight) +
          dropdownInset * 2
      : 0
  }

  /**
   * Calculates the direction that the dropdown should be displayed such that
   * the content is not outside of the viewport.
   *
   * @returns The direction the dropdown should be displayed.
   */
  const calculateDropdownDirection = () => {
    if (!input) {
      return DropdownDirection.down
    }

    const inputRect = input.getBoundingClientRect()
    const dropupThreshold = dropdownOptions?.dropupThreshold || 30

    if (
      inputRect.bottom +
        getDropdownHeight(searchResults.length) +
        dropupThreshold <
      window.innerHeight
    ) {
      return DropdownDirection.down
    } else {
      return DropdownDirection.up
    }
  }

  const stateReducer = (
    state: DownshiftState<ComboboxItem>,
    changes: StateChangeOptions<ComboboxItem>
  ) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.mouseUp:
        // reset inputValue to last valid input value
        if (!changes.inputValue) {
          return {
            ...changes,
            inputValue: state.selectedItem?.label || '',
          }
        }
    }
    return changes
  }

  // purely for adding padding insets to FixedStyleList
  // see https://codesandbox.io/s/react-window-list-padding-dg0pq
  const innerElementType = forwardRef(({ style, ...rest }, ref) => (
    <div
      ref={ref}
      style={{
        ...style,
        height: `${parseFloat(style.height) + dropdownInset * 2}px`,
      }}
      {...rest}
    />
  ))

  return (
    <Downshift
      initialHighlightedIndex={0}
      stateReducer={stateReducer}
      itemToString={(item) => item?.label || ''}
      onChange={(item) => {
        onChange(`${item ? item.value : ''}`)
      }}
      onInputValueChange={(inputValue) => {
        // recalculate top search results and scroll back to top of list
        updateSearchResults(inputValue)
        dropdownListRef.current?.scrollTo(0)
      }}
      defaultHighlightedIndex={0}
    >
      {({
        getRootProps,
        getMenuProps,
        getLabelProps,
        getInputProps,
        getItemProps,
        highlightedIndex,
        selectedItem,
        isOpen,
        openMenu,
        setState,
      }) => (
        <VStack
          {...getRootProps()}
          align="stretch"
          spacing={0}
          position="relative"
          flex={1}
        >
          <HStack
            spacing={0}
            zIndex={100}
            backgroundColor="white"
            borderRadius="5px"
          >
            <label {...getLabelProps()} hidden>
              {label}
            </label>
            <InputGroup>
              <Input
                zIndex={100}
                borderRadius={
                  inputOptions?.useClearButton ? '5px 0px 0px 5px' : '5px'
                }
                focusBorderColor={
                  searchResults.length > 0 ? '#3182ce' : 'error.500'
                }
                {...getInputProps({
                  ...props,
                  placeholder: 'Select an option',
                  ref: inputRef,
                  onFocus: () => {
                    // ensure that menu should be displayed within window bounds
                    setDropdownDir(calculateDropdownDirection())

                    // finally, toggle menu open
                    openMenu()
                    dropdownListRef.current?.scrollTo(0)
                  },
                })}
              />
              <InputRightElement pointerEvents="none">
                <BiChevronDown aria-label="dropdown-icon" color="black" />
              </InputRightElement>
            </InputGroup>
            {inputOptions?.useClearButton ? (
              <IconButton
                style={{ marginLeft: '-1px' }}
                aria-label="Clear"
                variant="outline"
                borderRadius="0px 5px 5px 0px"
                icon={<BiX size="16px" />}
                onClick={() => {
                  // reset field for new search
                  setState({ inputValue: '', selectedItem: null })
                  updateSearchResults('')

                  // refocus on input field
                  input.focus()
                }}
              />
            ) : null}
          </HStack>
          <Box
            boxShadow="0px 0px 10px rgba(216, 222, 235, 0.5)"
            position={'absolute'}
            maxH={`${dropdownHeight}px`}
            top={dropdownDir === DropdownDirection.down ? '40px' : undefined}
            bottom={dropdownDir === DropdownDirection.up ? '40px' : undefined}
            bg="white"
            w="100%"
            zIndex={99}
          >
            <FixedSizeList
              {...getMenuProps({
                ref: dropdownListRef,
              })}
              height={isOpen ? getDropdownHeight(searchResults.length) : 0}
              itemSize={itemHeight}
              itemCount={searchResults.length}
              itemData={
                {
                  items: searchResults,
                  highlightedIndex: highlightedIndex,
                  getItemProps: getItemProps,
                  selectedItem: selectedItem,
                  topDropdownInset: dropdownInset,
                } as ItemRendererProps['data']
              }
              innerElementType={innerElementType}
            >
              {ItemRenderer}
            </FixedSizeList>
          </Box>
        </VStack>
      )}
    </Downshift>
  )
}
