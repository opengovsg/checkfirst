import React, { FC } from 'react'
import { IconButton, VStack, Tooltip } from '@chakra-ui/react'

interface ToolbarOptions {
  onClick: React.MouseEventHandler
  icon: React.ReactElement
  label: string
}

interface FloatingToolbarProps {
  offsetTop: number
  options: ToolbarOptions[]
}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({
  options,
  offsetTop,
}) => {
  // 8px to account for margin between elements in VStack
  const top = `${offsetTop}px`

  // Animate the movement of the floating toolbar
  const transitionOpts = {
    transition: 'top 0.3s',
    transitionTimingFunction: 'ease-out',
  }

  return (
    <VStack
      {...transitionOpts}
      position="absolute"
      left="756px"
      top={top}
      ml={4}
      bg="white"
      py={3}
      borderRadius="12px"
      spacing={0}
      boxShadow="0px 0px 10px #DADEE3"
    >
      {options.map(({ label, icon, onClick }, i) => (
        <Tooltip key={i} label={label} placement="right">
          <IconButton
            borderRadius={0}
            variant="ghost"
            aria-label={label}
            fontSize="20px"
            icon={icon}
            onClick={onClick}
          />
        </Tooltip>
      ))}
    </VStack>
  )
}
