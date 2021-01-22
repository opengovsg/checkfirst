import React, { FC, useState, useEffect } from 'react'
import { Tabs, TabPanels, TabPanel, Flex } from '@chakra-ui/react'
import { useCheckerContext } from '../../client/contexts/CheckerContext'

import { Navbar, QuestionsTab, LogicTab } from '../components/builder'

// from typings
import * as H from 'history'

interface matchParams {
  id: string
}

interface RouteComponentProps<P> {
  match: match<P>
  location: H.Location
  history: H.History
  staticContext?: any
}

interface match<P> {
  params: P
  isExact: boolean
  path: string
  url: string
}

export const FormBuilder: FC<RouteComponentProps<matchParams>> = ({
  match,
}) => {
  const { id } = match.params
  const [tabIndex, setTabIndex] = useState(0)
  const { initChecker, save } = useCheckerContext()

  /* eslint-disable */
  useEffect(() => {
    (async function () {
      await initChecker(id)
    })()
  }, [])
  /* eslint-enable */

  const onSave = async () => {
    await save(id)
  }

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar index={tabIndex} onTabsChange={setTabIndex} onSave={onSave} />
      <Tabs index={tabIndex} mt="80px">
        <TabPanels>
          <TabPanel>
            <QuestionsTab />
          </TabPanel>
          <TabPanel>
            <LogicTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
