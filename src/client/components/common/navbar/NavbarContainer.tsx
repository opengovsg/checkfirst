import { Flex, useMultiStyleConfig } from '@chakra-ui/react'
import React, { FC, ReactNode } from 'react'

interface NavbarContainerProps {
  leftElement?: ReactNode
  centerElement?: ReactNode
  rightElement?: ReactNode
  variant?: 'preview'
}

/**
 * Parent navbar element. Contains the styles for the navbar container
 * and also handles the layout of child elements.
 *
 * Note that elements may overflow and affect the center element's position
 * (if it exists). This is intentional to support layouts that only use
 * left and right elements.
 *
 * @param leftElement The left aligned element to be rendered
 * @param centerElement The center aligned element to be rendered
 * @param rightElement The right aligned element to be rendered
 * @param variant The navbar theme variant.
 * @returns A styled navbar containing the elements passed into it
 */
export const NavbarContainer: FC<NavbarContainerProps> = ({
  leftElement,
  centerElement,
  rightElement,
  variant,
}) => {
  const styles = useMultiStyleConfig('NavbarContainer', { variant: variant })
  return (
    <Flex sx={styles.navbar}>
      <Flex sx={styles.leftElement}>{leftElement}</Flex>
      <Flex sx={styles.centerElement}>{centerElement}</Flex>
      <Flex sx={styles.rightElement}>{rightElement}</Flex>
    </Flex>
  )
}
