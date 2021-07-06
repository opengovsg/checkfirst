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
  Heading,
  Link,
  SimpleGrid,
  Center,
  Spinner,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react'

import {
  Navbar,
  CreateNewButton,
  CreateNewCard,
  CheckerCard,
  CreateNewModal,
  PreviewTemplate,
} from '../components/dashboard'
import { DashboardCheckerDTO } from '../../types/checker'
import { CheckerService } from '../services'

// Images
import emptyDashboardImage from '../assets/states/empty-dashboard.svg'

const GET_STARTED_URL = 'https://go.gov.sg/checkfirst-formbuilder'

const EmptyDashboardBody: FC = () => (
  <Center py={16}>
    <VStack spacing={4}>
      <Heading size="md" color="primary.500">
        You don't have any checkers yet
      </Heading>
      <Text>
        Start from scratch or use one of our templates. <br />
        <Center>
          <Link href={GET_STARTED_URL} isExternal color="primary.500">
            Learn how to get started
          </Link>
        </Center>
      </Text>
      <Image
        flex={1}
        src={emptyDashboardImage}
        height={{ base: '257px', lg: 'auto' }}
        mb={{ base: '24px', lg: '0px' }}
      />
      <CreateNewButton />
    </VStack>
  </Center>
)

export const Dashboard: FC = () => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const { isLoading, data: checkers } = useQuery('checkers', async () => {
    const response = await CheckerService.listCheckers()
    // Store whether checker has a published version. Used to enable checker active toggle switch in settings modal
    window.localStorage.setItem(
      'hasPublished',
      JSON.stringify(
        response.reduce((map, checker) => {
          const dashboardChecker = checker as DashboardCheckerDTO
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          map[checker.id] = dashboardChecker.publishedCheckers.length > 0
          return map
        }, {})
      )
    )
    return response as DashboardCheckerDTO[]
  })

  return (
    <Flex direction="column" minH="100vh" bgColor="neutral.200">
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
                <>
                  {checkers && checkers.length > 0 ? (
                    <SimpleGrid columns={4} spacing="32px">
                      <CreateNewCard />
                      {checkers?.map((checker) => {
                        return (
                          <CheckerCard key={checker.id} checker={checker} />
                        )
                      })}
                    </SimpleGrid>
                  ) : (
                    <EmptyDashboardBody />
                  )}
                </>
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

export default Dashboard
