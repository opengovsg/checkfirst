import React, { FC } from 'react'
import { AxiosError } from 'axios'
import { useIsFetching, useQueryClient } from 'react-query'
import { Container, Flex } from '@chakra-ui/react'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'

import * as checker from '../../types/checker'
import { Navbar, QuestionsTab, LogicTab } from '../components/builder'

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
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar />
      <Container maxW="756px" px={0} mt="80px">
        <Switch>
          <Route exact path={`${path}/questions`} component={QuestionsTab} />
          <Route exact path={`${path}/logic`} component={LogicTab} />
          <Redirect to={`${path}/questions`} />
        </Switch>
      </Container>
    </Flex>
  )
}
