import React, { FC } from 'react'
import { IconButtonProps, useStyles, IconButton } from '@chakra-ui/react'

export const ActionButton: FC<IconButtonProps> = (props) => {
  const styles = useStyles()
  return <IconButton {...props} variant="link" sx={styles.action} />
}
