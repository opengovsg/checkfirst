import React, { FC } from 'react'
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  useClipboard,
} from '@chakra-ui/react'
import { useStyledToast } from './StyledToast'
import { DefaultTooltip } from './DefaultTooltip'
import { BiCopy } from 'react-icons/bi'

type EmbedFieldProps = {
  name: string
  value: string
}

export const EmbedField: FC<EmbedFieldProps> = ({ name, value, children }) => {
  const { onCopy } = useClipboard(value)
  const styledToast = useStyledToast()
  const onClick = () => {
    onCopy()
    styledToast({
      status: 'success',
      description: 'Copied!',
    })
  }
  return (
    <FormControl mb="1rem">
      <FormLabel htmlFor={name} mb="0">
        <HStack spacing="1">{children}</HStack>
      </FormLabel>
      <InputGroup>
        <Input readOnly name={name} value={value} />
        <InputRightElement
          cursor="pointer"
          onClick={onClick}
          children={
            <DefaultTooltip label="Copy">
              <span>
                <BiCopy />
              </span>
            </DefaultTooltip>
          }
        />
      </InputGroup>
    </FormControl>
  )
}
