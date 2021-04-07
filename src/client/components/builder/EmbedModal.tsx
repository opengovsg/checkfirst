import React, { FC } from 'react'
import { BiCode, BiCopy, BiShareAlt } from 'react-icons/bi'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Text,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useClipboard,
} from '@chakra-ui/react'
import { Checker } from '../../../types/checker'

type EmbedFieldProps = {
  name: string
  value: string
}

const EmbedField: FC<EmbedFieldProps> = ({ name, value, children }) => {
  const { onCopy } = useClipboard(value)
  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const onClick = () => {
    onCopy()
    toast({
      status: 'success',
      title: 'Copied!',
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
          children={<BiCopy />}
        />
      </InputGroup>
    </FormControl>
  )
}

type EmbedModalProps = {
  isEmbedOpen: boolean
  onEmbedOpen: () => void
  onEmbedClose: () => void
  checker: Checker
  isChanged: boolean
}

export const EmbedModal: FC<EmbedModalProps> = ({
  isEmbedOpen,
  onEmbedOpen,
  onEmbedClose,
  checker,
  isChanged,
}) => {
  const linkTo = (checker: { id: string }) =>
    `${window?.location?.origin}/c/${checker.id}`

  return (
    <>
      <IconButton
        onClick={onEmbedOpen}
        aria-label="Embed or Share"
        variant="ghost"
        icon={<BiCode size="24px" />}
      />
      <Modal isOpen={isEmbedOpen} onClose={onEmbedClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Embed or Share</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="info">
              <AlertIcon />
              <AlertDescription>
                Embedded checker and sharing link will show your latest
                published version.
              </AlertDescription>
            </Alert>
            <EmbedField
              name="iframe"
              value={`<iframe src="${linkTo(
                checker
              )}" style="width:100%;height:500px"></iframe>`}
            >
              <BiCode size="1rem" />
              <Text>Embed this checker on your site</Text>
            </EmbedField>
            <EmbedField name="link" value={linkTo(checker)}>
              <BiShareAlt size="1rem" />
              <Text>Share this link to your checker</Text>
            </EmbedField>
          </ModalBody>
          <ModalFooter>
            <Text color="error.500">
              {isChanged ? 'Warning: You have unsaved changes' : ''}
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
