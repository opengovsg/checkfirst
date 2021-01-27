import React, { FC } from 'react'
import { BiArrowBack, BiCode, BiCopy, BiShareAlt } from 'react-icons/bi'
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
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useClipboard,
} from '@chakra-ui/react'

import { LogoutButton } from '../LogoutButton'
import { useCheckerContext } from '../../contexts'

const ROUTES = ['questions', 'logic']

type EmbedFieldProps = {
  name: string
  value: string
}

const EmbedField: FC<EmbedFieldProps> = ({ name, value, children }) => {
  const { onCopy } = useClipboard(value)
  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const onClick = () => {
    onCopy()
    toast({
      status: 'success',
      title: 'Copied!',
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
          children={<BiCopy />}
        />
      </InputGroup>
    </FormControl>
  )
}

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
  const { save, isChanged, config: checker } = useCheckerContext()

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

  const linkTo = (checker: { id: string }) =>
    `${window?.location?.origin}/c/${checker.id}`

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
        <Text fontWeight="600">{match?.params.id}</Text>
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
        <IconButton
          onClick={onEmbedOpen}
          aria-label="Embed or Share"
          variant="ghost"
          icon={<BiCode size="24px" />}
        />
        <Modal isOpen={isEmbedOpen} onClose={onEmbedClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Embed or Share</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EmbedField
                name="iframe"
                value={`<iframe src="${linkTo(checker)}"></iframe>`}
              >
                <BiCode size="1rem" />
                <Text>Embed this checker on your site</Text>
              </EmbedField>
              <EmbedField name="link" value={linkTo(checker)}>
                <BiShareAlt size="1rem" />
                <Text>Share this link to your checker</Text>
              </EmbedField>
            </ModalBody>
            <ModalFooter>
              <Text color="error.500">
                {isChanged ? 'Warning: You have unsaved changes' : ''}
              </Text>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Link to={`/builder/${params.id}/preview`}>
          <Button variant="outline" colorScheme="primary">
            Preview
          </Button>
        </Link>
        <Button
          colorScheme="primary"
          onClick={handleSave}
          disabled={!isChanged}
          isLoading={save.isLoading}
        >
          Save
        </Button>
        <LogoutButton />
      </HStack>
    </Flex>
  )
}
