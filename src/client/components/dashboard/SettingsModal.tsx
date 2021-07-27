import axios from 'axios'
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
  Input,
  IconButton,
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  useDisclosure,
  Spinner,
  Skeleton,
} from '@chakra-ui/react'
import { Box, Text } from '@chakra-ui/layout'
import { BiLinkExternal, BiTrash } from 'react-icons/bi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts'
import { useStyledToast } from '../common/StyledToast'
import { ConfirmDialog } from '../ConfirmDialog'
import { DefaultTooltip } from '../common/DefaultTooltip'
import { getApiErrorMessage } from '../../api'
import { CheckerService } from '../../services'

import { EmbedField } from '../common/EmbedField'
import { CollaboratorUser } from '../../../types/user'

type CollaboratorsTableProps = {
  collaboratorsData: CollaboratorUser[] | undefined
  onDelete: (collaboratorEmail: string) => () => void
  userEmail?: string
}

const CollaboratorsList: FC<CollaboratorsTableProps> = ({
  collaboratorsData,
  onDelete,
  userEmail,
}) => {
  const tableItems = collaboratorsData?.map((collaborator) => {
    return (
      <Tr key={collaborator.id}>
        <Td px={0} py={0}>
          {collaborator.email +
            (collaborator.email === userEmail ? ' (you)' : '')}
        </Td>
        <Td px={0} py={0}>
          {collaborator.UserToChecker.isOwner ? (
            <Text color="grey">Owner</Text>
          ) : (
            <Text>Editor</Text>
          )}
        </Td>
        <Td px={0} py={0}>
          {collaborator.UserToChecker.isOwner ? (
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

export const SettingsModal: FC = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const styledToast = useStyledToast()
  const history = useHistory()

  const checkerId =
    useParams<{
      id?: string
    }>().id || ''

  const [selectedCollaborator, setSelectedCollaborator] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [inputEmail, setInputEmail] = useState('')

  const onClose = () => history.goBack()
  // External live checker link
  const linkToChecker = `${window?.location?.origin}/c/${checkerId}`

  const {
    isOpen: isConfirmRemoveOpen,
    onOpen: onConfirmRemoveOpen,
    onClose: onConfirmRemoveClose,
  } = useDisclosure()

  // Get published checker
  const {
    isFetchedAfterMount: publishedCheckerIsFetched,
    data: publishedChecker,
  } = useQuery(
    [checkerId, 'publishedChecker'],
    () => CheckerService.getPublishedChecker(checkerId),
    {
      onSuccess: (data) => {
        setIsDisabled(!data)
        setIsActive(!!data?.isActive)
      },
      onError: (err) => {
        // If 404, it means that the checker is not yet published
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setIsDisabled(true)
          setIsActive(false)
        }
      },
    }
  )

  // Get list of checker collaborators
  const {
    isFetchedAfterMount: collaboratorsDataIsFetched,
    data: collaboratorsData,
    refetch: refetchCollaborators,
  } = useQuery(
    [checkerId, 'collaborators'],
    async () =>
      (await CheckerService.listCollaborators(checkerId)) as CollaboratorUser[]
  )

  // Update checker isActive
  const setActive = useMutation(CheckerService.setActive, {
    onSuccess: (data) => {
      styledToast({
        status: 'success',
        description: `Your checker has been ${
          isActive ? 'inactivated' : 'activated'
        }`,
      })
      // Refetch checkers again to ensure that their status are up-to-date on dashboard
      queryClient.invalidateQueries('checkers')
      setIsActive(data)
      setIsDisabled(false)
    },
    onError: (err) => {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
      setIsDisabled(false)
      setIsActive(isActive)
    },
  })

  // Adding a collaborator
  const addCollaborator = useMutation(CheckerService.addCollaborator, {
    onSuccess: () => {
      refetchCollaborators()
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

  // Removing a collaborator
  const deleteCollaborator = useMutation(CheckerService.deleteCollaborator, {
    onSuccess: (_, variables) => {
      styledToast({
        status: 'success',
        description: `Collaborator ${variables.collaboratorEmail} has been deleted successfully`,
      })
      // Requery checker dashboard list and kick user back to dashboard if they are removing themselves
      if (variables.collaboratorEmail === user?.email) {
        queryClient.invalidateQueries('checkers')
        onClose()
        history.push('/dashboard')
      } else refetchCollaborators()
    },
    onError: (err) => {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    },
  })

  // Handle is active switch toggle
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDisabled(true)
    setActive.mutateAsync({
      id: checkerId,
      isActive: event.target.checked,
    })
  }

  // Handle collaborator email input field on change
  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => setInputEmail(event.target.value)

  // Handle add button collaborator on click
  const onAddCollaborator = () => {
    addCollaborator.mutateAsync({
      id: checkerId,
      collaboratorEmail: inputEmail,
    })
  }

  // Handle remove collaborator button on click, opens confirmation modal
  const onRemoveCollaborator = (collaboratorEmail: string) => () => {
    setSelectedCollaborator(collaboratorEmail)
    onConfirmRemoveOpen()
  }

  // Handle confirm delete collaborator modal button on click
  const onRemoveConfirm = () => {
    deleteCollaborator.mutateAsync({
      id: checkerId,
      collaboratorEmail: selectedCollaborator,
    })
  }

  // Label component with display logic for whether checker is active or not
  const checkerActiveLabel = (
    hasPublished: boolean,
    isActive: boolean,
    isFetched: boolean
  ) => {
    if (!isFetched) {
      return (
        <FormLabel color="grey">
          Loading checker state
          <Text color="grey" fontSize="xs">
            Awaiting checker data
          </Text>
        </FormLabel>
      )
    }
    if (hasPublished) {
      if (isActive) {
        return (
          <FormLabel htmlFor="isPublished">
            Your checker is{' '}
            {
              <Text as="span" color="green">
                active
              </Text>
            }{' '}
            and accessible by the public
            <Text color="grey" fontSize="xs">
              Checker will show your latest published changes
            </Text>
          </FormLabel>
        )
      } else {
        return (
          <FormLabel htmlFor="isPublished">
            Your checker is{' '}
            {
              <Text as="span" color="red">
                inactive
              </Text>
            }{' '}
            and inaccessible by the public
            <Text color="grey" fontSize="xs">
              Citizens will see an error message if they come across your
              checker
            </Text>
          </FormLabel>
        )
      }
    } else {
      return (
        <FormLabel htmlFor="isPublished">
          Your checker is a draft and inaccessible by the public
          <Text color="grey" fontSize="xs">
            Publish your changes to activate your checker
          </Text>
        </FormLabel>
      )
    }
  }

  return (
    <Modal isOpen onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent py="16px">
        <ModalHeader>Checker Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <HStack spacing={0}>
                {checkerActiveLabel(
                  !!publishedChecker,
                  isActive,
                  publishedCheckerIsFetched
                )}
                <Spacer />
                {!publishedCheckerIsFetched ? (
                  <Spinner size="md" color="grey" />
                ) : (
                  <Switch
                    id="isPublished"
                    isChecked={isActive}
                    colorScheme="teal"
                    isDisabled={isDisabled}
                    onChange={onSwitchChange}
                  />
                )}
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
                    isActive
                      ? `Open live checker`
                      : `Publish and activate your checker first`
                  }
                >
                  <Link href={isActive ? linkToChecker : undefined} isExternal>
                    <IconButton
                      colorScheme="primary"
                      aria-label="Open published form link"
                      icon={<BiLinkExternal />}
                      type="submit"
                      rounded="md"
                      isDisabled={!isActive}
                    />
                  </Link>
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
                  isLoading={addCollaborator.isLoading}
                  isDisabled={inputEmail.length === 0}
                  onClick={onAddCollaborator}
                >
                  Add collaborator
                </Button>
              </HStack>
            </FormControl>
            <Divider />

            <Table variant="simple">
              {!(collaboratorsDataIsFetched && user) ? (
                <>
                  <Skeleton height="25px" />
                  <Skeleton height="25px" mt={2} />
                  <Skeleton height="25px" mt={2} />
                </>
              ) : (
                CollaboratorsList({
                  userEmail: user.email,
                  collaboratorsData,
                  onDelete: onRemoveCollaborator,
                })
              )}
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
