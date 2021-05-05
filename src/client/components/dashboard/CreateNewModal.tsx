import React, { FC } from 'react'
import {
  useParams,
  Switch,
  Redirect,
  Route,
  useHistory,
} from 'react-router-dom'
import { useQueryClient, useQuery, useMutation } from 'react-query'
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
  Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { CheckerService, TemplateService } from '../../services'
import { getApiErrorMessage } from '../../api'
import { SelectTemplate } from './SelectTemplate'

export type CreateNewModalProps = {
  onClose: () => void
}

export const CreateNewModal: FC<CreateNewModalProps> = ({ onClose }) => {
  const history = useHistory()
  const initial = {
    title: '',
    description: '',
    fields: [],
    constants: [],
    operations: [],
    displays: [],
  }

  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const { trigger, register, handleSubmit, formState, setValue } = useForm({
    mode: 'onChange',
  })
  const { isValid, errors } = formState

  const { checkerId, templateId } = useParams<{
    checkerId?: string
    templateId?: string
  }>()

  const {
    isLoading: isCheckerLoading,
    isError: isCheckerError,
    data: checker,
  } = useQuery(
    ['checker', checkerId],
    () => {
      if (checkerId) return CheckerService.getChecker(checkerId)
    },
    {
      enabled: !!checkerId,
      onSuccess: (checker) => {
        if (checker) {
          setValue('title', checker.title)
          setValue('description', checker.description)
          trigger()
        }
      },
    }
  )

  const {
    isLoading: isTemplateLoading,
    isError: isTemplateError,
    data: template,
  } = useQuery(
    ['template', templateId],
    () => {
      if (templateId) return TemplateService.getTemplate(templateId)
    },
    {
      enabled: !!templateId,
      onSuccess: (template) => {
        if (template) {
          setValue('title', template.title)
          setValue('description', template.description)
          trigger()
        }
      },
    }
  )

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
      history.push(`/builder/${created.id}`)
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
    const base = checker || template || initial
    createChecker.mutate({
      ...base,
      ...data,
      id: uuidv4(), // Set id to be a random uuid string
    })
  }

  // Redirect to dashboard for non-existent checker
  if (isCheckerError || isTemplateError) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Modal isOpen onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent py="16px">
        <Switch>
          <Route
            exact
            path="/dashboard/create"
            render={() => <SelectTemplate />}
          />
          <Route>
            <ModalHeader>
              {checker ? `Duplicate ${checker.title}` : 'Create new checker'}
            </ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.title}>
                    <FormLabel htmlFor="id">Title</FormLabel>
                    <Input
                      isDisabled={isCheckerLoading || isTemplateLoading}
                      name="title"
                      ref={register({ required: 'Title is required' })}
                    />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="description">
                      Description{' '}
                      <Text as="span" color="grey">
                        (Optional)
                      </Text>
                    </FormLabel>
                    <Textarea
                      isDisabled={isCheckerLoading || isTemplateLoading}
                      name="description"
                      resize="none"
                      ref={register}
                    />
                  </FormControl>
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
          </Route>
        </Switch>
      </ModalContent>
    </Modal>
  )
}
