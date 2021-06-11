import React, { FC } from 'react'
import { Tabs } from '@chakra-ui/react'
import { TabsProps } from '@chakra-ui/tabs'
import { NavbarTab } from './NavbarTab'
import { NavbarTabList } from './NavbarTabList'

interface NavbarTabsProps extends Omit<TabsProps, 'children'> {
  tabTitles: string[]
}

/**
 * Shorthand Tabs component that composes a standard tab modal with
 * styled Navbar components, which aligns to the design system.
 *
 * @param tabTitles An array of strings to name the tabs, arranged in order
 * @returns A standard Tabs modal with styled tabs
 */
export const NavbarTabs: FC<NavbarTabsProps> = ({ tabTitles, ...props }) => {
  return (
    <Tabs {...props}>
      <NavbarTabList>
        {tabTitles.map((title) => (
          <NavbarTab key={title}>{title}</NavbarTab>
        ))}
      </NavbarTabList>
    </Tabs>
  )
}
