import React, { FC, useState } from 'react'
import { BiPlusCircle, BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi'
import {
  Tabs,
  TabPanels,
  TabPanel,
  Container,
  Flex,
  VStack,
} from '@chakra-ui/react'

import * as checker from '../../types/checker'
import { FloatingToolbar, Navbar, NumericField } from '../components/builder'

const fields: checker.Field[] = [
  {
    id: 'A',
    type: 'NUMERIC',
    description: 'Question 1',
    help: '',
    options: [],
  },
  {
    id: 'B',
    type: 'NUMERIC',
    description: 'Question 2',
    help: '',
    options: [],
  },
  {
    id: 'C',
    type: 'NUMERIC',
    description: 'Question 3',
    help: '',
    options: [],
  },
]

export const FormBuilder: FC = () => {
  const [activeId, setActiveId] = useState<string>(fields[0].id)
  const [offsetTop, setOffsetTop] = useState<number>(48)
  const [tabIndex, setTabIndex] = useState(0)

  const toolbarOptions = [
    {
      icon: <BiPlusCircle />,
      label: 'Add question',
      onClick: () => console.log('clicked'),
    },
    {
      icon: <BiUpArrowAlt />,
      label: 'Move up',
      onClick: () => console.log('move up'),
    },
    {
      icon: <BiDownArrowAlt />,
      label: 'Move down',
      onClick: () => console.log('move down'),
    },
  ]

  const onSelect = ({ id }: { id: string }) => {
    setActiveId(id)
  }

  const onActive = ({ top }: { top: number }) => {
    setOffsetTop(top)
  }

  const fieldProps = { onActive, onSelect }
  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar onTabsChange={setTabIndex} />
      <Tabs index={tabIndex} mt="80px">
        <TabPanels>
          <TabPanel>
            <Container maxW="756px" px={0}>
              <VStack align="stretch" py="40px" position="relative">
                {activeId && (
                  <FloatingToolbar
                    offsetTop={offsetTop}
                    options={toolbarOptions}
                  />
                )}

                {fields.map((field) => (
                  <NumericField
                    active={activeId === field.id}
                    field={field}
                    {...fieldProps}
                  />
                ))}
              </VStack>
            </Container>
          </TabPanel>
          <TabPanel>
            <Container maxW="756px" px={0}>
              Logic UI Components Here
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
