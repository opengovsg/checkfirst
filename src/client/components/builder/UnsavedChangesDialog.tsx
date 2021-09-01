import React, { FC } from 'react'

import {
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UseModalProps,
} from '@chakra-ui/react'

interface UnsavedChangesDialogProps extends UseModalProps {
  onDiscard?: () => void
}

export const UnsavedChangesDialog: FC<UnsavedChangesDialogProps> = ({
  isOpen,
  onClose,
  onDiscard,
}) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Warning</ModalHeader>
        <ModalBody>
          You have unsaved changes. Leaving will discard any changes made to
          this block. Are you sure you want to discard changes?
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose}>
              Back to editing
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                if (onDiscard) onDiscard()
                onClose()
              }}
            >
              Discard changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
