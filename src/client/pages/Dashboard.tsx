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
import { Checker } from '../../types/checker'
import { CheckerService } from '../services'

// Images
import emptyDashboardImage from '../assets/states/empty-dashboard.svg'

const GET_STARTED_URL = 'https://guide.checkfirst.gov.sg/'

const EmptyDashboardBody: FC = () => (
  <Center py={16}>
    <VStack spacing={4}>
      <Heading size="md" color="#1B3C87">
        You don't have any checkers yet
      </Heading>
      <Text>
        Start from scratch or use one of our templates. <br />
        <Link href={GET_STARTED_URL} isExternal color="#1B3C87">
          Learn how to get started
        </Link>
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
                <>
                  {checkers && checkers.length > 0 ? (
                    <SimpleGrid columns={5} spacing={8}>
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
