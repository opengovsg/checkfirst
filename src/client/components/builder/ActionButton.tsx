import React, { FC } from 'react'
import { IconButtonProps, IconButton, useStyleConfig } from '@chakra-ui/react'

export const ActionButton: FC<IconButtonProps> = (props) => {
  const { colorScheme, ...rest } = props
  const styles = useStyleConfig('ActionButton', { colorScheme })
  return <IconButton {...rest} variant="ghost" sx={styles} />
}
