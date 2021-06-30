import React from 'react'
import { Box } from '@chakra-ui/react'
import { TabListProps, useTabList } from '@chakra-ui/tabs'

/**
 * Unstyled TabList component. Used in tandem with the NavbarTab component
 * to create styled tab modals that are aligned with to the design system
 */
export const NavbarTabList = React.forwardRef<HTMLDivElement, TabListProps>(
  // only props are required, refer to the documentation for more info
  // https://chakra-ui.com/docs/disclosure/tabs#creating-custom-tab-components
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (props, ref) => {
    const tabListProps = useTabList(props)
    return <Box {...tabListProps}>{tabListProps.children}</Box>
  }
)
