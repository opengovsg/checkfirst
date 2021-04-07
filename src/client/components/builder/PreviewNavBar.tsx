import React, { FC } from 'react'
import { Link, Redirect, useRouteMatch } from 'react-router-dom'
import { getApiErrorMessage } from '../../api'
import {
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { BiEditAlt } from 'react-icons/bi'
import { EmbedModal } from '.'

import { useCheckerContext } from '../../contexts'

export const PreviewNavBar: FC = () => {
  const {
    isOpen: isEmbedOpen,
    onOpen: onEmbedOpen,
    onClose: onEmbedClose,
  } = useDisclosure()
  const { publish, isChanged, config: checker } = useCheckerContext()
  const toast = useToast({ position: 'bottom-right', variant: 'solid' })

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
      toast({
        status: 'success',
        title: 'Checker published',
        description: 'Your checker is now live.',
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
      bgColor="#EBEFFE"
      px={10}
      alignItems="center"
      position="fixed"
      w="100%"
      zIndex={999}
    >
      <HStack flex={1}>
        <Text color="#1B3C87" fontWeight="600">
          PREVIEW MODE
        </Text>
      </HStack>
      <HStack flex={1} spacing={4} justifyContent="flex-end">
        <EmbedModal
          isEmbedOpen={isEmbedOpen}
          onEmbedOpen={onEmbedOpen}
          onEmbedClose={onEmbedClose}
          checker={checker}
          isChanged={isChanged}
        />
        <Link to={`/builder/${params.id}/questions`}>
          <Button
            variant="outline"
            colorScheme="primary"
            leftIcon={<BiEditAlt size="20px" />}
          >
            Edit
          </Button>
        </Link>
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={handlePublish}
          isLoading={publish.isLoading}
        >
          Publish
        </Button>
      </HStack>
    </Flex>
  )
}
