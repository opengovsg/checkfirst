import { Tooltip, TooltipProps } from '@chakra-ui/react'
import React, { FC } from 'react'

/**
 * Wrapper for Chakra Tooltip with default props provided
 *
 * @see Docs     https://chakra-ui.com/components/tooltip
 */
export const DefaultTooltip: FC<TooltipProps> = ({ ...props }) => (
  <Tooltip {...props} placement="right" closeOnMouseDown closeOnClick />
)

DefaultTooltip.defaultProps = {
  gutter: 16,
  hasArrow: true,
}
