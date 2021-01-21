import React, { FC, useState } from 'react'
import {
  useMultiStyleConfig,
  Button,
  IconButton,
  HStack,
  VStack,
  Tooltip,
} from '@chakra-ui/react'

interface ToolbarMenuItem {
  label: string
  icon: React.ReactElement
  onClick?: React.MouseEventHandler
}

interface ToolbarOptions {
  icon: React.ReactElement
  label: string
  menu?: ToolbarMenuItem[]
  onClick?: React.MouseEventHandler
  disabled?: boolean
}

interface FloatingToolbarProps {
  offsetTop: number
  options: ToolbarOptions[]
}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({
  options,
  offsetTop,
}) => {
  const styles = useMultiStyleConfig('FloatingToolbar', {})
  const [menu, setMenu] = useState<ToolbarMenuItem[] | undefined>(undefined)

  // 8px to account for margin between elements in VStack
  const top = `${offsetTop}px`

  // Animate the movement of the floating toolbar
  const transitionOpts = {
    transition: 'top 0.3s',
    transitionTimingFunction: 'ease-out',
  }

  const handleActiveClick = (
    e: React.MouseEvent,
    { onClick, menu }: ToolbarOptions
  ) => {
    if (menu) {
      // Add listener to close menu when clicked elsewhere
      setTimeout(() => {
        window.addEventListener('click', () => setMenu(undefined), {
          once: true,
        })
      })
      return setMenu(menu)
    }
    if (onClick) onClick(e)
  }

  return (
    <HStack
      {...transitionOpts}
      position="absolute"
      left="756px"
      top={top}
      ml={4}
      spacing={4}
      alignItems="flex-start"
    >
      <VStack sx={styles.container} spacing={0}>
        {options.map((option, i) => {
          const { label, icon, disabled } = option
          return (
            <Tooltip key={i} label={label} placement="right">
              <IconButton
                borderRadius={0}
                variant="ghost"
                aria-label={label}
                fontSize="20px"
                icon={icon}
                onClick={(e) => handleActiveClick(e, option)}
                disabled={disabled}
              />
            </Tooltip>
          )
        })}
      </VStack>
      {menu && (
        <VStack sx={styles.container} spacing={0}>
          {menu.map(({ label, icon, onClick }, i) => (
            <Button
              key={i}
              variant="ghost"
              sx={styles.menuItem}
              leftIcon={icon}
              iconSpacing={2}
              onClick={onClick}
            >
              {label}
            </Button>
          ))}
        </VStack>
      )}
    </HStack>
  )
}
