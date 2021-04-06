import React, { FC } from 'react'
import { BiArrowBack, BiShow } from 'react-icons/bi'
import { getApiErrorMessage } from '../../api'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Link, Redirect } from 'react-router-dom'
import {
  Text,
  Tabs,
  TabList,
  Tab,
  IconButton,
  Button,
  Flex,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'

import { EmbedModal } from '.'
import { LogoutButton } from '../LogoutButton'
import { useCheckerContext } from '../../contexts'

const ROUTES = ['questions', 'constants', 'logic']

export const Navbar: FC = () => {
  const {
    isOpen: isBackPromptOpen,
    onOpen: onBackPromptOpen,
    onClose: onBackPromptClose,
  } = useDisclosure()
  const {
    isOpen: isEmbedOpen,
    onOpen: onEmbedOpen,
    onClose: onEmbedClose,
  } = useDisclosure()
  const history = useHistory()
  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const match = useRouteMatch<{ id: string; action: string }>({
    path: '/builder/:id/:action',
    exact: true,
  })
  const { save, publish, isChanged, config: checker } = useCheckerContext()

  const params = match?.params
  if (!params || !params.id || !params.action) {
    return <Redirect to="/dashboard" />
  }

  const index = ROUTES.indexOf(params.action)

  const checkBeforeBack = () => {
    if (!isChanged) {
      history.push('/dashboard')
    } else {
      onBackPromptOpen()
    }
  }

  const handleTabChange = (index: number) => {
    const id = match?.params.id
    if (id) history.push(`/builder/${id}/${ROUTES[index]}`)
  }

  const handleSave = async () => {
    try {
      await save.mutateAsync()
      toast({
        status: 'success',
        title: 'Checker saved',
        description: 'Your checker has been saved successfully.',
      })
    } catch (err) {
      toast({
        status: 'error',
        title: 'An error occurred',
        description: getApiErrorMessage(err),
      })
    }
  }

  const handlePublish = async () => {
    try {
      await publish.mutateAsync()
      toast({
        status: 'success',
        title: 'Checker published',
        description: 'Your checker is now live. View it here.',
      })
    } catch (err) {
      toast({
        status: 'error',
        title: 'An error occurred',
        description: getApiErrorMessage(err),
      })
    }
  }

  return (
    <Flex
      h="80px"
      direction="row"
      bgColor="white"
      px={10}
      alignItems="center"
      position="fixed"
      w="100%"
      zIndex={999}
    >
      <HStack flex={1}>
        <IconButton
          onClick={checkBeforeBack}
          aria-label="Back"
          variant="ghost"
          icon={<BiArrowBack />}
        />
        <Modal isOpen={isBackPromptOpen} onClose={onBackPromptClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Discard changes?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              You have unsaved changes. Do you wish to discard them?
            </ModalBody>
            <ModalFooter>
              <Button onClick={onBackPromptClose} variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={() => history.push('/dashboard')}
                colorScheme="error"
              >
                Discard
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Text fontWeight="600">{checker.title}</Text>
      </HStack>
      <HStack h="100%" flex={1} justifyContent="center" spacing={0}>
        <Tabs
          defaultIndex={0}
          onChange={handleTabChange}
          w="250px"
          h="100%"
          align="center"
          colorScheme="primary"
          isFitted
          index={index}
        >
          <TabList h="100%">
            {ROUTES.map((routeName) => (
              <Tab
                key={routeName}
                borderBottom="solid 4px"
                fontWeight="bold"
                textTransform="capitalize"
              >
                {routeName}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </HStack>
      <HStack flex={1} spacing={4} justifyContent="flex-end">
        <EmbedModal
          isEmbedOpen={isEmbedOpen}
          onEmbedOpen={onEmbedOpen}
          onEmbedClose={onEmbedClose}
          checker={checker}
          isChanged={isChanged}
        />
        <Link to={`/builder/${params.id}/preview`}>
          <IconButton
            aria-label="Preview"
            variant="ghost"
            icon={<BiShow size="24px" />}
          />
        </Link>
        <Button
          variant="outline"
          colorScheme="primary"
          onClick={handleSave}
          disabled={!isChanged}
          isLoading={save.isLoading}
        >
          Save Draft
        </Button>
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={handlePublish}
          isLoading={publish.isLoading}
        >
          Publish
        </Button>
        <LogoutButton />
      </HStack>
    </Flex>
  )
}
