import { Tooltip, TooltipProps } from '@chakra-ui/react'
import React, { FC } from 'react'

/**
 * Wrapper for Chakra Tooltip with default props provided
 *
 * @see Docs     https://chakra-ui.com/components/tooltip
 */
export const DefaultTooltip: FC<TooltipProps> = ({ ...props }) => (
  <Tooltip {...props} />
)

DefaultTooltip.defaultProps = {
  gutter: 16,
  openDelay: 800,
  hasArrow: true,
}
