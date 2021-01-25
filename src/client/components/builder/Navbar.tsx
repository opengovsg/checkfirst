import React, { FC } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { getApiErrorMessage } from '../../api'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  Tabs,
  TabList,
  Tab,
  IconButton,
  Button,
  Flex,
  HStack,
  useToast,
} from '@chakra-ui/react'

import { LogoutButton } from '../LogoutButton'
import { useCheckerContext } from '../../contexts'

const ROUTES = ['questions', 'logic']

export const Navbar: FC = () => {
  const history = useHistory()
  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const match = useRouteMatch<{ id: string; action: string }>({
    path: '/builder/:id/:action',
    exact: true,
  })
  const { save } = useCheckerContext()
  const index = match?.params.action ? ROUTES.indexOf(match?.params.action) : 0

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
      <HStack>
        <Link to={'/dashboard'}>
          <IconButton
            aria-label="Back"
            variant="ghost"
            icon={<BiArrowBack />}
          />
          <Button variant="ghost">{match?.params.id}</Button>
        </Link>
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
      <HStack>
        <Button
          colorScheme="primary"
          onClick={handleSave}
          isLoading={save.isLoading}
        >
          Save
        </Button>
        <LogoutButton />
      </HStack>
    </Flex>
  )
}
