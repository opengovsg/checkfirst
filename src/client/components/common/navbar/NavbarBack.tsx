import React, { FC } from 'react'
import { HStack, Text, IconButton, useMultiStyleConfig } from '@chakra-ui/react'
import { BiArrowBack } from 'react-icons/bi'

interface NavbarBackProps {
  label: string
  handleClick: () => void
}

export const NavbarBack: FC<NavbarBackProps> = ({ label, handleClick }) => {
  const styles = useMultiStyleConfig('NavbarBack', {})

  return (
    <HStack>
      <IconButton
        variant="link"
        sx={styles.button}
        aria-label="Back"
        icon={<BiArrowBack />}
        onClick={handleClick}
      />
      <Text sx={styles.text}>{label}</Text>
    </HStack>
  )
}
