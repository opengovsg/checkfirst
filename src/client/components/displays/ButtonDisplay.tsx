import React, { FC } from 'react'
import { Button, Link } from '@chakra-ui/react'

export interface ButtonProps {
  buttonText: string
  buttonUrl: string
}

export const ButtonDisplay: FC<ButtonProps> = ({ buttonText, buttonUrl }) => {
  return (
    <Link href={buttonUrl}>
      <Button>{buttonText}</Button>
    </Link>
  )
}
