import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormControl, Input } from '@chakra-ui/react'

export interface ConstantProps {
  id: string
  value: string
}

export const Constant: FC<ConstantProps> = ({ id, value }) => {
  const { register } = useFormContext()
  return (
    <FormControl id={id}>
      <Input type="hidden" name={id} value={value} ref={register()} />
    </FormControl>
  )
}
