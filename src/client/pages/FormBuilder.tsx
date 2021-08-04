import React, { FC } from 'react'
import { AxiosError } from 'axios'
import { useIsFetching, useQueryClient } from 'react-query'
import { Container, Flex } from '@chakra-ui/react'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'

import * as checker from '../../types/checker'
import {
  Navbar,
  QuestionsTab,
  ConstantsTab,
  LogicTab,
  PreviewTab,
  PreviewNavBar,
  HelpButton,
} from '../components/builder'
import { SettingsModal } from '../components/dashboard/SettingsModal'

const WithNavBar: FC = ({ children }) => {
  const { path } = useRouteMatch()
  return (
    <Flex direction="column" minH="100vh" bgColor="neutral.200">
      <Navbar />
      <HelpButton />
      <Container
        h="calc(100vh - 73px)"
        overflow="auto"
        mt="73px"
        maxW="100vw"
        pb="32px"
      >
        <Container maxW="756px" px={0}>
          {children}
        </Container>
      </Container>
      <Switch>
        <Route exact path={`${path}/settings`} component={SettingsModal} />
      </Switch>
    </Flex>
  )
}

const WithPreviewNavBar: FC = ({ children }) => (
  <Flex direction="column" minH="100vh" bgColor="neutral.200">
    <PreviewNavBar />
    <Flex
      h="calc(100vh - 73px)"
      overflow="auto"
      mt="73px"
      pb="32px"
      direction="column"
      alignItems="center"
    >
      {children}
    </Flex>
  </Flex>
)

export const FormBuilder: FC = () => {
  const {
    path,
    params: { id },
  } = useRouteMatch<{ id: string }>()
  const isLoading = useIsFetching(['builder', id])
  const queryClient = useQueryClient()
  const queryState = queryClient.getQueryState<
    checker.Checker,
    AxiosError<{ message: string }>
  >(['builder', id])

  // If not found or unauthorised, redirect back to dashboard
  if (!isLoading && queryState?.error) {
    // TODO: Redirect to an error page when we have one
    return <Redirect to="/dashboard" />
  }

  return (
    <Switch>
      <Route path={`${path}/questions`}>
        <WithNavBar>
          <QuestionsTab />
        </WithNavBar>
      </Route>
      <Route path={`${path}/constants`}>
        <WithNavBar>
          <ConstantsTab />
        </WithNavBar>
      </Route>
      <Route path={`${path}/logic`}>
        <WithNavBar>
          <LogicTab />
        </WithNavBar>
      </Route>
      <Route exact path={`${path}/preview`}>
        <WithPreviewNavBar>
          <PreviewTab />
        </WithPreviewNavBar>
      </Route>
      <Redirect to={`${path}/questions`} />
    </Switch>
  )
}

export default FormBuilder
