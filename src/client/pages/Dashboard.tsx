import React, { FC } from 'react'
import {
  useHistory,
  useRouteMatch,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Container,
  Flex,
  SimpleGrid,
  Center,
  Spinner,
  VStack,
} from '@chakra-ui/react'

import {
  Navbar,
  CreateNew,
  CheckerCard,
  CreateNewModal,
  PreviewTemplate,
} from '../components/dashboard'
import { Checker } from '../../types/checker'
import { CheckerService } from '../services'

export const Dashboard: FC = () => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const { isLoading, data: checkers } = useQuery('checkers', async () => {
    const response = await CheckerService.listCheckers()
    return response as Checker[]
  })

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Switch>
        <Route
          exact
          path="/dashboard/create/template/:templateId/preview"
          component={PreviewTemplate}
        />
        <Route>
          <Navbar />
          <Container maxW="960px" pt="80px" px={0}>
            <VStack align="stretch" py={10} position="relative">
              {isLoading ? (
                <Center>
                  <Spinner thickness="4px" color="primary.500" size="xl" />
                </Center>
              ) : (
                <SimpleGrid columns={5} spacing={8}>
                  <CreateNew />
                  {checkers?.map((checker) => {
                    return <CheckerCard key={checker.id} checker={checker} />
                  })}
                </SimpleGrid>
              )}
            </VStack>
          </Container>
          <Switch>
            <Route
              exact
              path={[
                `${path}/create`,
                `${path}/create/new`,
                `${path}/create/template/:templateId`,
                `${path}/duplicate/:checkerId`,
              ]}
              render={() => (
                <CreateNewModal onClose={() => history.push(path)} />
              )}
            />
            <Redirect to={path} />
          </Switch>
        </Route>
      </Switch>
    </Flex>
  )
}
