import React, { useState, FC } from 'react'
import { BiPlus } from 'react-icons/bi'
import {
  useStyleConfig,
  useDisclosure,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
} from '@chakra-ui/react'

import { Checker } from '../../../types/checker'
import { ApiClient } from '../../api'

export type CreateNewProps = {
  onSuccess: () => void
}

export const CreateNew: FC<CreateNewProps> = ({ onSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const styles = useStyleConfig('CheckerCard', {})

  const initial = {
    id: '',
    title: '',
    description: '',
    fields: [],
    constants: [],
    operations: [],
    displays: [],
  }

  const [checker, setChecker] = useState<Checker>(initial)

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
      setChecker({ ...checker, id })
    }
  }

  const setTitle = (event: React.FocusEvent<HTMLInputElement>) => {
    const title = event.target.value
    const invalid = title === ''
    setTitleInvalid(invalid)
    if (!invalid) {
      setChecker({ ...checker, title })
    }
  }

  const setDescription = (event: React.FocusEvent<HTMLInputElement>) => {
    const description = event.target.value
    if (!description) {
      const newChecker = { ...checker }
      delete newChecker.description
      setChecker(newChecker)
    } else {
      setChecker({ ...checker, description })
    }
  }

  const resetAndClose = () => {
    setChecker(initial)
    setErrorText('')
    onClose()
  }

  const onSubmit = async () => {
    try {
      await ApiClient.post('/c', checker)
      onSuccess()
      resetAndClose()
    } catch (error) {
      setErrorText(error.response.data.message)
    }
  }

  return (
    <>
      <Box onClick={onOpen} sx={styles} bg="primary.500" color="white">
        <BiPlus size="50px" style={{ display: 'inline', marginTop: '36px' }} />
        <Text mt="16px" fontSize="16px" fontWeight="600">
          Create New
        </Text>
      </Box>
      <Modal isOpen={isOpen} onClose={resetAndClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Checker</ModalHeader>
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
            <Input
              onBlur={setDescription}
              placeholder="Description (optional)"
            />
          </ModalBody>

          <ModalFooter>
            <Text color="error.500">{errorText}</Text>
            <Button onClick={resetAndClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={
                checker.id === '' ||
                checker.title === '' ||
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
    </>
  )
}
