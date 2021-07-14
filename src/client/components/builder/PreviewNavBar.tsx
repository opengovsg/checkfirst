import React, { FC } from 'react'
import { Link, Redirect, useRouteMatch } from 'react-router-dom'
import { getApiErrorMessage } from '../../api'
import {
  Button,
  HStack,
  Text,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { BiEditAlt } from 'react-icons/bi'
import { EmbedModal } from '.'

import { useCheckerContext } from '../../contexts'
import { useStyledToast } from '../common/StyledToast'
import { NavbarContainer } from '../common/navbar/NavbarContainer'

export const PreviewNavBar: FC = () => {
  const {
    isOpen: isEmbedOpen,
    onOpen: onEmbedOpen,
    onClose: onEmbedClose,
  } = useDisclosure()
  const { publish, isChanged, config: checker } = useCheckerContext()
  const styledToast = useStyledToast()

  const navStyles = useMultiStyleConfig('NavbarComponents', {})

  const match = useRouteMatch<{ id: string; action: string }>({
    path: '/builder/:id/:action',
    exact: true,
  })

  const params = match?.params
  if (!params || !params.id || !params.action) {
    return <Redirect to="/dashboard" />
  }

  const handlePublish = async () => {
    try {
      await publish.mutateAsync()
      styledToast({
        status: 'success',
        description: 'Your checker is now live.',
      })
    } catch (err) {
      styledToast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    }
  }

  return (
    <NavbarContainer
      variant="preview"
      leftElement={
        <Text textStyle="subhead3" color="primary.500">
          PREVIEW MODE
        </Text>
      }
      rightElement={
        <HStack>
          <HStack spacing={0}>
            <EmbedModal
              isEmbedOpen={isEmbedOpen}
              onEmbedOpen={onEmbedOpen}
              onEmbedClose={onEmbedClose}
              checker={checker}
              isChanged={isChanged}
            />
          </HStack>
          <Link to={`/builder/${params.id}/questions`}>
            <Button
              variant="outline"
              sx={navStyles.button}
              colorScheme="primary"
              leftIcon={<BiEditAlt size="20px" />}
            >
              Edit
            </Button>
          </Link>
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
  )
}
