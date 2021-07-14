import React, { FC } from 'react'
import { BiCheck, BiCog, BiShow } from 'react-icons/bi'
import { getApiErrorMessage } from '../../api'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import {
  Link,
  IconButton,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../contexts'
import { DefaultTooltip } from '../common/DefaultTooltip'
import { useStyledToast } from '../common/StyledToast'
import { NavbarContainer, NavbarTabs, NavbarBack } from '../common/navbar'

const ROUTES = ['questions', 'constants', 'logic']

export const Navbar: FC = () => {
  const {
    isOpen: isBackPromptOpen,
    onOpen: onBackPromptOpen,
    onClose: onBackPromptClose,
  } = useDisclosure()
  const history = useHistory()
  const styledToast = useStyledToast()
  const match = useRouteMatch<{ id: string; action: string }>({
    path: '/builder/:id/:action',
  })
  const { save, publish, isChanged, config: checker } = useCheckerContext()

  const navStyles = useMultiStyleConfig('NavbarComponents', {})

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
      styledToast({
        status: 'success',
        description: 'Your checker has been saved successfully.',
      })
    } catch (err) {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    }
  }

  const handlePublish = async () => {
    try {
      await publish.mutateAsync()
      styledToast({
        status: 'success',
        description: 'Your changes have been saved to your published checker.',
      })
    } catch (err) {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    }
  }

  const onSettings = () => {
    history.push(`${match?.url}/settings`, { checker })
  }

  return (
    <>
      <NavbarContainer
        leftElement={
          <NavbarBack label={checker.title} handleClick={checkBeforeBack} />
        }
        centerElement={
          <NavbarTabs
            defaultIndex={0}
            onChange={handleTabChange}
            align="center"
            index={index}
            tabTitles={ROUTES}
          />
        }
        rightElement={
          <HStack>
            <HStack spacing={0} pr={2}>
              <IconButton
                onClick={onSettings}
                aria-label="Embed or Share"
                variant="ghost"
                color="primary.500"
                icon={<BiCog size="16px" />}
              />
              <Link href={`/builder/${params.id}/preview`} isExternal>
                <DefaultTooltip label="Preview">
                  <IconButton
                    aria-label="Preview"
                    variant="ghost"
                    sx={navStyles.button}
                    color="primary.500"
                    icon={<BiShow size="16px" />}
                  />
                </DefaultTooltip>
              </Link>
            </HStack>
            <Button
              variant="outline"
              sx={navStyles.button}
              leftIcon={!isChanged ? <BiCheck size="24px" /> : undefined}
              colorScheme="primary"
              onClick={handleSave}
              disabled={!isChanged}
              isLoading={save.isLoading}
            >
              {isChanged ? 'Save draft' : 'Saved'}
            </Button>
            <Button
              variant="solid"
              sx={navStyles.button}
              colorScheme="primary"
              onClick={handlePublish}
              isLoading={publish.isLoading}
            >
              Publish changes
            </Button>
          </HStack>
        }
      />

      {/* Unsaved Changes Modal */}
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
    </>
  )
}
