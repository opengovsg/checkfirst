import React, { FC, useState } from 'react'
import { Tabs, TabPanels, TabPanel, Flex } from '@chakra-ui/react'

import { Navbar, QuestionsTab, LogicTab } from '../components/builder'

export const FormBuilder: FC = () => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar index={tabIndex} onTabsChange={setTabIndex} />
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
