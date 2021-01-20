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
import {
  FloatingToolbar,
  Navbar,
  NumericField,
  RadioField,
  CheckboxField,
} from '../components/builder'

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
    type: 'RADIO',
    description: 'Question 3',
    help: '',
    options: [
      { label: 'Option 1', value: 0 },
      { label: 'Option 2', value: 1 },
    ],
  },
  {
    id: 'D',
    type: 'RADIO',
    description: 'Question 4',
    help: '',
    options: [
      { label: 'Option 1', value: 0 },
      { label: 'Option 2', value: 1 },
    ],
  },
  {
    id: 'E',
    type: 'CHECKBOX',
    description: 'Question 5',
    help: '',
    options: [
      { label: 'Option 1', value: 0 },
      { label: 'Option 2', value: 1 },
    ],
  },
  {
    id: 'F',
    type: 'CHECKBOX',
    description: 'Question 6',
    help: '',
    options: [
      { label: 'Option 1', value: 0 },
      { label: 'Option 2', value: 1 },
    ],
  },
]

export const FormBuilder: FC = () => {
  const [activeId, setActiveId] = useState<string>(fields[0].id)
  const [offsetTop, setOffsetTop] = useState<number>(16)
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

  const renderField = (field: checker.Field) => {
    const commonProps = {
      key: field.id,
      active: activeId === field.id,
      field,
      onActive,
      onSelect,
    }

    switch (field.type) {
      case 'RADIO':
        return <RadioField {...commonProps} />
      case 'CHECKBOX':
        return <CheckboxField {...commonProps} />
      case 'NUMERIC':
        return <NumericField {...commonProps} />
    }
  }

  return (
    <Flex direction="column" minH="100vh" bgColor="#F4F6F9">
      <Navbar onTabsChange={setTabIndex} />
      <Tabs index={tabIndex} mt="80px">
        <TabPanels>
          <TabPanel>
            <Container maxW="756px" px={0}>
              <VStack align="stretch" position="relative" spacing={4}>
                {activeId && (
                  <FloatingToolbar
                    offsetTop={offsetTop}
                    options={toolbarOptions}
                  />
                )}
                {fields.map(renderField)}
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
