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
  FormControl,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { useForm, FormProvider } from 'react-hook-form'

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

  const methods = useForm({ mode: 'onBlur' })
  const { register, handleSubmit, formState } = methods
  const { isValid, errors } = formState

  const [submitError, setSubmitError] = useState('')

  const onSubmit = async (data: {
    id: string
    title: string
    description: string
  }) => {
    const newChecker = {
      ...(checker || initial),
      ...data,
    }
    try {
      setSubmitError('')
      await ApiClient.post('/c', newChecker)
      onSuccess()
      onClose()
    } catch (error) {
      setSubmitError(error.response.data.message)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {checker ? `Copy ${checker.id}` : 'Create New Checker'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl isInvalid={errors.id}>
                <Input
                  name="id"
                  ref={register({
                    required: 'Id is required',
                    pattern: {
                      value: /^[a-z0-9-]+[a-z0-9]+$/,
                      message:
                        'Id must be lowercase letters and numbers, separated by -',
                    },
                  })}
                />
              </FormControl>
              <FormControl isInvalid={errors.title}>
                <Input
                  name="title"
                  ref={register({ required: 'Title is required' })}
                />
              </FormControl>
              <FormControl isInvalid={errors.description}>
                <Input name="description" ref={register({})} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <HStack flex={1}>
                <VStack>
                  <Text color="error.500">{submitError}</Text>
                  {Object.entries(errors).map(([field, error]) => {
                    return (
                      <Text key={field} color="error.500">
                        {error.message}
                      </Text>
                    )
                  })}
                </VStack>
              </HStack>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                disabled={!isValid}
                type="submit"
                colorScheme="primary"
                mr={3}
              >
                Create
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>

        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}
