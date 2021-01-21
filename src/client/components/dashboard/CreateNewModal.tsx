import React, { FC, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Text,
} from '@chakra-ui/react'

import { Checker } from '../../../types/checker'
import { ApiClient } from '../../api'

export type CreateNewModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  checker?: Checker
}

export const CreateNewModal: FC<CreateNewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  checker,
}) => {
  const initial = {
    id: '',
    title: '',
    description: '',
    fields: [],
    constants: [],
    operations: [],
    displays: [],
  }

  const [newChecker, setChecker] = useState<Checker>(
    checker
      ? {
          ...checker,
          id: initial.id,
          title: initial.title,
          description: initial.description,
        }
      : initial
  )

  const [idInvalid, setIdInvalid] = useState(false)
  const [titleInvalid, setTitleInvalid] = useState(false)
  const [errorText, setErrorText] = useState('')

  const setId = (event: React.FocusEvent<HTMLInputElement>) => {
    const id = event.target.value
    const invalid = !/^[a-z0-9-]+[a-z0-9]+$/.test(id)
    setIdInvalid(invalid)
    setErrorText(
      invalid ? 'Id must be lowercase letters and numbers, separated by -' : ''
    )
    if (!invalid) {
      setChecker({ ...newChecker, id })
    }
  }

  const setTitle = (event: React.FocusEvent<HTMLInputElement>) => {
    const title = event.target.value
    const invalid = title === ''
    setTitleInvalid(invalid)
    if (!invalid) {
      setChecker({ ...newChecker, title })
    }
  }

  const setDescription = (event: React.FocusEvent<HTMLInputElement>) => {
    const description = event.target.value
    if (!description) {
      const checkerWithoutDescription = { ...newChecker }
      delete checkerWithoutDescription.description
      setChecker(checkerWithoutDescription)
    } else {
      setChecker({ ...newChecker, description })
    }
  }

  const resetAndClose = () => {
    setChecker(initial)
    setErrorText('')
    onClose()
  }

  const onSubmit = async () => {
    try {
      await ApiClient.post('/c', newChecker)
      onSuccess()
      resetAndClose()
    } catch (error) {
      setErrorText(error.response.data.message)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {checker ? `Copy ${checker.id}` : 'Create New Checker'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            isRequired
            onBlur={setId}
            isInvalid={idInvalid}
            placeholder="Id"
          />
          <Input
            isRequired
            onBlur={setTitle}
            isInvalid={titleInvalid}
            placeholder="Title"
          />
          <Input onBlur={setDescription} placeholder="Description (optional)" />
        </ModalBody>

        <ModalFooter>
          <Text color="error.500">{errorText}</Text>
          <Button onClick={resetAndClose} variant="ghost">
            Cancel
          </Button>
          <Button
            disabled={
              newChecker.id === '' ||
              newChecker.title === '' ||
              idInvalid ||
              titleInvalid
            }
            onClick={onSubmit}
            colorScheme="primary"
            mr={3}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
