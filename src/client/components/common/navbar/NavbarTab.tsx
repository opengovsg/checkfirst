import {
  Box,
  TabProps,
  useTab,
  Text,
  Link,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import React from 'react'
import { ConditionalWrapper } from '../ConditionalWrapper'

interface NavbarTabProps extends TabProps {
  externalLink?: string
}

/**
 * Custom Tab element. Provides themed styles and support for external links
 * that work without the need for a `window.open()` call.
 */
export const NavbarTab = React.forwardRef<HTMLButtonElement, NavbarTabProps>(
  // only props are required, refer to the documentation for more info
  // https://chakra-ui.com/docs/disclosure/tabs#creating-custom-tab-components
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ externalLink, ...props }, ref) => {
    const tabProps = useTab(props)
    const isSelected = !!tabProps['aria-selected']
    const styles = useMultiStyleConfig('NavbarTab', {
      variant: isSelected ? 'selected' : undefined,
    })

    // wrap tab in a link element if external link prop is used
    // this avoids having to open windows with the default `window.open()`
    // method, which can possibly be blocked by Safari / Firefox
    return (
      <ConditionalWrapper
        condition={!!externalLink}
        wrapper={(children) => (
          <Link href={externalLink} isExternal>
            {children}
          </Link>
        )}
      >
        <Box as="button" {...tabProps} sx={styles.tab}>
          <Text sx={styles.text}>{tabProps.children}</Text>
        </Box>
      </ConditionalWrapper>
    )
  }
)
