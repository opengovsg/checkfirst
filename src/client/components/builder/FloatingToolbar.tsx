import React, { FC } from 'react'
import { IconButton, VStack } from '@chakra-ui/react'

interface ToolbarOptions {
  onClick: React.MouseEventHandler
  icon: React.ReactElement
}

interface FloatingToolbarProps {
  offsetTop: number
  options: ToolbarOptions[]
}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({
  options,
  offsetTop,
}) => {
  // We position the floating toolbar using top margin. 8px is the default padding for
  // each element in the VStack.
  const marginTop = `${offsetTop + 8}px`

  // Animate the movement of the floating toolbar
  const transitionOpts = {
    transition: 'margin-top 0.3s',
    transitionTimingFunction: 'ease-out',
  }

  return (
    <VStack
      {...transitionOpts}
      position="absolute"
      left="756px"
      mt={marginTop}
      ml={4}
      bg="white"
      py={3}
      borderRadius="12px"
      spacing={0}
      boxShadow="0px 0px 10px #DADEE3"
    >
      {options.map((opt, i) => (
        <IconButton
          key={i}
          borderRadius={0}
          variant="ghost"
          aria-label="Back"
          fontSize="20px"
          icon={opt.icon}
          onClick={opt.onClick}
        />
      ))}
    </VStack>
  )
}
