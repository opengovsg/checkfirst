import React, { FC } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { CheckerService } from '../../services'
import { Checker } from '../../../types/checker'
import { getApiErrorMessage } from '../../api'

export type CreateNewModalProps = {
  isOpen: boolean
  onClose: () => void
  checker?: Checker
}

export const CreateNewModal: FC<CreateNewModalProps> = ({
  isOpen,
  onClose,
  checker,
}) => {
  const initial = {
    id: uuidv4(), // Set id to be a random uuid string
    title: '',
    description: '',
    fields: [],
    constants: [],
    operations: [],
    displays: [],
  }

  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const methods = useForm({ mode: 'onBlur' })
  const { register, handleSubmit, formState } = methods
  const { isValid, errors } = formState

  const queryClient = useQueryClient()
  const createChecker = useMutation(CheckerService.createChecker, {
    onSuccess: (created) => {
      queryClient.invalidateQueries('checkers')
      toast({
        status: 'success',
        title: 'Checker created',
        description: `${created?.title} has been created successfully`,
      })
      onClose()
    },
    onError: (err) => {
      toast({
        status: 'error',
        title: 'Unable to create checker',
        description: getApiErrorMessage(err),
      })
    },
  })

  const onSubmit = async (data: {
    id: string
    title: string
    description: string
  }) => {
    createChecker.mutate({
      ...(checker || initial),
      ...data,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {checker ? `Copy ${checker.id}` : 'Create new checker'}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              {!checker && (
                <>
                  <FormControl isInvalid={errors.title}>
                    <FormLabel htmlFor="id">Title</FormLabel>
                    <Input
                      name="title"
                      ref={register({ required: 'Title is required' })}
                    />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.description}>
                    <FormLabel htmlFor="id">Description</FormLabel>
                    <Textarea name="description" resize="none" ref={register} />
                  </FormControl>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                disabled={!isValid}
                type="submit"
                colorScheme="primary"
                isLoading={createChecker.isLoading}
              >
                Create
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
