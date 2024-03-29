import React, { FC } from 'react'
import { BiCode, BiShareAlt } from 'react-icons/bi'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Checker } from '../../../types/checker'
import { DefaultTooltip } from '../common/DefaultTooltip'
import { EmbedField } from '../common/EmbedField'

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
      <DefaultTooltip label="Embed or Share">
        <IconButton
          onClick={onEmbedOpen}
          aria-label="Embed or Share"
          variant="ghost"
          color="primary.500"
          icon={<BiCode size="16px" />}
        />
      </DefaultTooltip>
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
