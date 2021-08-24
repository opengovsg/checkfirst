import React, { FC } from 'react'
import { BiCog, BiShow } from 'react-icons/bi'
import { getApiErrorMessage } from '../../api'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import {
  Link,
  IconButton,
  Button,
  HStack,
  useMultiStyleConfig,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../contexts'
import { DefaultTooltip } from '../common/DefaultTooltip'
import { useStyledToast } from '../common/StyledToast'
import { NavbarContainer, NavbarTabs, NavbarBack } from '../common/navbar'

const ROUTES = ['questions', 'constants', 'logic']

export const Navbar: FC = () => {
  const history = useHistory()
  const styledToast = useStyledToast()
  const match = useRouteMatch<{ id: string; action: string }>({
    path: '/builder/:id/:action',
  })
  const { save, publish, config: checker } = useCheckerContext()

  const navStyles = useMultiStyleConfig('NavbarComponents', {})

  const params = match?.params
  if (!params || !params.id || !params.action) {
    return <Redirect to="/dashboard" />
  }

  const index = ROUTES.indexOf(params.action)

  const checkBeforeBack = () => {
    history.push('/dashboard')
  }

  const handleTabChange = (index: number) => {
    const id = match?.params.id
    if (id) history.push(`/builder/${id}/${ROUTES[index]}`)
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
    history.push(`${match?.url}/settings`)
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
              variant="solid"
              sx={navStyles.button}
              colorScheme="primary"
              onClick={handlePublish}
              isLoading={publish.isLoading}
              isDisabled={save.isLoading}
            >
              Publish changes
            </Button>
          </HStack>
        }
      />
    </>
  )
}
