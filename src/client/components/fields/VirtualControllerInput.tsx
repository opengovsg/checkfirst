import React, { CSSProperties, forwardRef } from 'react'
import { Input, Box } from '@chakra-ui/react'

interface VirtualControllerInputProps {
  style?: CSSProperties
}

/**
 * A invisible input component for use with react-hook-form controllers.
 *
 * By passing in the input ref from the controller as a prop, it enables the
 * scroll into view functionality for irregular inputs such as radio groups, date fields
 * and checkbox fields.
 *
 * @param ref The react-hook-form controller ref property
 * @returns A invisible, focusable input.
 */
const VirtualControllerInput = forwardRef<
  HTMLInputElement,
  VirtualControllerInputProps
>(({ style }, ref) => {
  return (
    <Box h="0" opacity="0" overflow="hidden" aria-hidden="true">
      <Input ref={ref} style={style} readOnly />
    </Box>
  )
})

export default VirtualControllerInput
