import React, { FC, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  HStack,
  Spacer,
  Divider,
  Link,
  useClipboard,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  useDisclosure,
} from '@chakra-ui/react'
import { Checker } from '../../../types/checker'
import { Box, Text } from '@chakra-ui/layout'
import { useStyledToast } from '../common/StyledToast'
import { DefaultTooltip } from '../common/DefaultTooltip'
import { BiCopy, BiLinkExternal, BiTrash } from 'react-icons/bi'
import User from '../../../types/user'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getApiErrorMessage } from '../../api'
import { CheckerService } from '../../services'
import { ConfirmDialog } from '../ConfirmDialog'
import { useAuth } from '../../contexts'
import { useHistory } from 'react-router-dom'

export type CreateSettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  checker: Checker
}

type EmbedFieldProps = {
  name: string
  value: string
}

type CollaboratorsData = {
  id: number
  email: string
  isOwner: boolean
}

type CollaboratorsTableProps = {
  collaboratorsData: CollaboratorsData[] | undefined
  onDelete: (collaboratorEmail: string) => () => void
}

const EmbedField: FC<EmbedFieldProps> = ({ name, value, children }) => {
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

// TODO set component style for tables
const CollaboratorsList: FC<CollaboratorsTableProps> = ({
  collaboratorsData,
  onDelete,
}) => {
  const { user } = useAuth()
  const tableItems = collaboratorsData?.map((collaborator) => {
    return (
      <Tr key={collaborator.id}>
        <Td px={0} py={0}>
          {collaborator.email +
            (collaborator.email === user?.email ? ' (you)' : '')}
        </Td>
        <Td px={0} py={0}>
          {collaborator.isOwner ? (
            <Text color="grey">Owner</Text>
          ) : (
            <Text>Editor</Text>
          )}
        </Td>
        <Td px={0} py={0}>
          {collaborator.isOwner ? (
            <Box height="40px" />
          ) : (
            <IconButton
              aria-label="Delete collaborator"
              icon={<BiTrash color="red" />}
              variant="ghost"
              rounded="md"
              onClick={onDelete(collaborator.email)}
            />
          )}
        </Td>
      </Tr>
    )
  })

  return <Tbody>{tableItems}</Tbody>
}

export const SettingsModal: FC<CreateSettingsModalProps> = ({
  isOpen,
  onClose,
  checker,
}) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const styledToast = useStyledToast()

  // Hold email of collaborator to be added from input field
  const [inputEmail, setInputEmail] = useState('')
  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => setInputEmail(event.target.value)

  // Is checker published toggle switch state
  // TODO implement isActive toggle
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPublished, setIsPublished] = useState(
    checker.publishedCheckers.length > 0
  )

  // External live checker link
  const linkToChecker = `${window?.location?.origin}/c/${checker.id}`
  const openLinkToChecker = () => window.open(linkToChecker)

  // Get list of checker collaborators
  const { data: collaboratorsData, refetch } = useQuery(
    [checker.id, 'collaborators'],
    async () => {
      const users = await CheckerService.listCollaborators(checker.id)
      return users.map((user: User) => {
        return {
          id: user.id,
          email: user.email,
          // TODO typing
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          isOwner: user.UserToChecker.isOwner,
        } as CollaboratorsData
      })
    }
  )

  // Adding a collaborator
  const addCollaborator = useMutation(CheckerService.addCollaborator, {
    onSuccess: () => {
      refetch()
      setInputEmail('')
      styledToast({
        status: 'success',
        description: `${inputEmail} has been added successfully`,
      })
    },
    onError: (err) => {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    },
  })

  const onAddCollaborator = () => {
    addCollaborator.mutate({
      id: checker.id,
      collaboratorEmail: inputEmail,
    })
  }

  // Removing a collaborator
  const [selectedCollaborator, setSelectedCollaborator] = useState('')
  const {
    isOpen: isConfirmRemoveOpen,
    onOpen: onConfirmRemoveOpen,
    onClose: onConfirmRemoveClose,
  } = useDisclosure()
  const history = useHistory()
  const deleteCollaborator = useMutation(CheckerService.deleteCollaborator, {
    onSuccess: (_, variables) => {
      styledToast({
        status: 'success',
        description: `Collaborator ${variables.collaboratorEmail} has been deleted successfully`,
      })
      // Remove checker from dashboard if user is deleting themself as a collaborator
      if (variables.collaboratorEmail === user?.email) {
        queryClient.invalidateQueries('checkers')
        onClose()
        history.push('/dashboard')
      } else refetch()
    },
    onError: (err) => {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    },
  })

  // Table row delete button on click
  const onRemoveCollaborator = (collaboratorEmail: string) => () => {
    setSelectedCollaborator(collaboratorEmail)
    onConfirmRemoveOpen()
  }

  // Remove collaborator confirm dialog on click
  const onRemoveConfirm = () => {
    deleteCollaborator.mutate({
      id: checker.id,
      collaboratorEmail: selectedCollaborator,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent py="16px">
        <ModalHeader>Checker Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <HStack spacing={0}>
                <FormLabel htmlFor="isPublished">
                  {isPublished
                    ? `Your checker is published and accessible to the public`
                    : `Your checker is a draft and inaccessible by the public`}
                  <Text color="grey" fontSize="xs">
                    Publish your changes to activate your checker
                  </Text>
                </FormLabel>
                <Spacer />
                <Switch
                  id="isPublished"
                  defaultChecked={isPublished}
                  colorScheme="teal"
                />
              </HStack>
            </FormControl>
            <Divider />

            <FormControl>
              <FormLabel htmlFor="share">
                Share link
                <Text color="grey" fontSize="xs">
                  Create an official short link and QR code with{' '}
                  <Link color="blue.700" href="https://go.gov.sg/#/">
                    Go.gov.sg
                  </Link>{' '}
                  and share it over the Internet
                </Text>
              </FormLabel>
              <HStack spacing={1} align="stretch">
                <EmbedField name="iframe" value={linkToChecker} />
                <Spacer />
                <DefaultTooltip
                  label={
                    isPublished
                      ? `Open live checker`
                      : `Publish your checker first`
                  }
                >
                  <IconButton
                    colorScheme="primary"
                    aria-label="Open published form link"
                    icon={<BiLinkExternal />}
                    onClick={openLinkToChecker}
                    rounded="md"
                    isDisabled={!isPublished}
                  />
                </DefaultTooltip>
              </HStack>
            </FormControl>
            <Divider />

            <FormControl>
              <FormLabel htmlFor="embed">
                Embed HTML
                <Text color="grey" fontSize="xs">
                  Embed this checker on your site
                </Text>
              </FormLabel>
              <EmbedField
                name="iframe"
                value={`<iframe src="${linkToChecker}" style="width:100%;height:500px"></iframe>`}
              />
            </FormControl>
            <Divider />
          </VStack>
        </ModalBody>

        <ModalHeader>Manage Collaborators</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="collaborators">
                Add collaborators or transfer checker ownership
                <Text color="grey" fontSize="xs">
                  Only users that have logged in to CheckFirst before with a
                  government email may be added as collaborators
                </Text>
              </FormLabel>
              <HStack spacing={2}>
                <Input
                  placeholder="me@example.gov.sg"
                  value={inputEmail}
                  onChange={handleInputChange}
                />
                <Button
                  type="submit"
                  colorScheme="primary"
                  fontSize="sm"
                  width="170px"
                  aria-label="Add collaborator"
                  onClick={onAddCollaborator}
                >
                  Add collaborator
                </Button>
              </HStack>
            </FormControl>
            <Divider />

            <Table variant="simple">
              {CollaboratorsList({
                collaboratorsData,
                onDelete: onRemoveCollaborator,
              })}
            </Table>
          </VStack>
        </ModalBody>
      </ModalContent>

      <ConfirmDialog
        isOpen={isConfirmRemoveOpen}
        onClose={onConfirmRemoveClose}
        onConfirm={onRemoveConfirm}
        title="Remove collaborator"
        description="Are you sure? You cannot undo this action afterwards."
      />
    </Modal>
  )
}
