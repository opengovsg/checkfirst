import React, { FC, useEffect, useState } from 'react'
import {
  BiPlus,
  BiPlusCircle,
  BiCalculator,
  BiGitBranch,
  BiUpArrowAlt,
  BiDownArrowAlt,
  BiGitCompare,
  BiCalendar,
} from 'react-icons/bi'
import {
  Box,
  Center,
  Text,
  Image,
  Link,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuIcon,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../contexts'
import * as checker from '../../../types/checker'
import { FloatingToolbar } from '../builder'
import {
  CalculatedResult,
  ConditionalResult,
  MapResult,
  DateResult,
} from '../builder/logic'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'
import useActiveIndex from '../../hooks/use-active-index'

// Images
import emptyLogicTabImage from '../../assets/states/empty-logic.svg'

const LOGIC_CONSTANTS_GUIDE_URL = 'https://go.gov.sg/checkfirst-logic'

const generateDefaultArithmeticOp = (id: number): checker.Operation => ({
  id: `O${id}`,
  type: 'ARITHMETIC',
  title: 'Calculated result',
  expression: '1 + 1',
  show: true,
})

const generateDefaultIfelseOp = (id: number): checker.Operation => ({
  id: `O${id}`,
  type: 'IFELSE',
  title: 'Conditional result',
  expression: 'ifelse(1 > 0, true, false)',
  show: true,
})

const generateDefaultMapOp = (id: number): checker.Operation => ({
  id: `O${id}`,
  type: 'MAP',
  title: 'Map constant',
  expression: '0',
  show: true,
})

const generateDefaultDateOp = (id: number): checker.Operation => ({
  id: `O${id}`,
  type: 'DATE',
  title: 'Date result',
  expression: '',
  show: true,
})

export const LogicTab: FC = () => {
  const { dispatch, config, checkHasChanged } = useCheckerContext()
  const [activeIndex, setActiveIndex] = useActiveIndex(config.operations)
  const [offsetTop, setOffsetTop] = useState<number>(16)
  const [nextUniqueId, setNextUniqueId] = useState<number>(1)

  useEffect(() => {
    let highestIndex = 0
    config.operations.forEach((operation) => {
      const operationIndex = parseInt(operation.id.slice(1))
      highestIndex = Math.max(highestIndex, operationIndex)
    })
    setNextUniqueId(highestIndex + 1)
  }, [config])

  const addMenu = [
    {
      label: 'Calculation',
      icon: <BiCalculator />,
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Add,
          payload: {
            element: generateDefaultArithmeticOp(nextUniqueId),
            configArrName: ConfigArrayEnum.Operations,
            newIndex: activeIndex + 1,
          },
        })
        setActiveIndex(activeIndex + 1)
        setNextUniqueId(nextUniqueId + 1)
      },
    },
    {
      label: 'Conditional',
      icon: <BiGitBranch />,
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Add,
          payload: {
            element: generateDefaultIfelseOp(nextUniqueId),
            configArrName: ConfigArrayEnum.Operations,
            newIndex: activeIndex + 1,
          },
        })
        setActiveIndex(activeIndex + 1)
        setNextUniqueId(nextUniqueId + 1)
      },
    },
    {
      label: 'Map constants',
      icon: <BiGitCompare />,
      disabled: config.constants.length === 0,
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Add,
          payload: {
            element: generateDefaultMapOp(nextUniqueId),
            configArrName: ConfigArrayEnum.Operations,
            newIndex: activeIndex + 1,
          },
        })
        setActiveIndex(activeIndex + 1)
        setNextUniqueId(nextUniqueId + 1)
      },
    },
    {
      label: 'Date calculation',
      icon: <BiCalendar />,
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Add,
          payload: {
            element: generateDefaultDateOp(nextUniqueId),
            configArrName: ConfigArrayEnum.Operations,
            newIndex: activeIndex + 1,
          },
        })
        setActiveIndex(activeIndex + 1)
        setNextUniqueId(nextUniqueId + 1)
      },
    },
  ]
  const toolbarOptions = [
    {
      icon: <BiPlusCircle />,
      label: 'Add result',
      menu: addMenu,
    },
    {
      icon: <BiUpArrowAlt />,
      label: 'Move up',
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Reorder,
          payload: {
            currIndex: activeIndex,
            newIndex: activeIndex - 1,
            configArrName: ConfigArrayEnum.Operations,
          },
        })
        setActiveIndex(activeIndex - 1)
      },
      disabled: activeIndex === 0,
    },
    {
      icon: <BiDownArrowAlt />,
      label: 'Move down',
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Reorder,
          payload: {
            currIndex: activeIndex,
            newIndex: activeIndex + 1,
            configArrName: ConfigArrayEnum.Operations,
          },
        })
        setActiveIndex(activeIndex + 1)
      },
      disabled: activeIndex === config.operations.length - 1,
    },
  ]

  const onSelect = ({ index }: { index: number }) => {
    checkHasChanged(() => setActiveIndex(index))
  }

  const onActive = ({ top }: { top: number }) => {
    setOffsetTop(top)
  }

  const renderOperation = (op: checker.Operation, index: number) => {
    const commonProps = {
      key: op.id + index,
      id: op.id,
      active: activeIndex === index,
      data: op,
      index,
      onActive,
      onSelect,
      setActiveIndex,
      nextUniqueId,
      setNextUniqueId,
    }

    switch (op.type) {
      case 'ARITHMETIC':
        return <CalculatedResult {...commonProps} />
      case 'IFELSE':
        return <ConditionalResult {...commonProps} />
      case 'MAP':
        return <MapResult {...commonProps} />
      case 'DATE':
        return <DateResult {...commonProps} />
    }
  }

  return (
    <>
      <VStack align="stretch" position="relative" spacing={4}>
        {config.operations.length > 0 ? (
          <FloatingToolbar offsetTop={offsetTop} options={toolbarOptions} />
        ) : (
          <Center py={16}>
            <VStack spacing={4} w="100%">
              <Text textStyle="heading2" color="primary.500">
                Build a logical brain for your checker
              </Text>
              <Text textAlign="center">
                Use input from questions to make calculations or generate a
                logic outcome.
                <br />
                <Link
                  href={LOGIC_CONSTANTS_GUIDE_URL}
                  isExternal
                  color="primary.500"
                >
                  Learn how to work with logic
                </Link>
              </Text>
              <Box pt="16px" pb="32px">
                <Menu placement="bottom">
                  <MenuButton
                    leftIcon={<BiPlus />}
                    as={Button}
                    colorScheme="primary"
                  >
                    Add logic
                  </MenuButton>
                  <MenuList>
                    {addMenu.map(({ label, icon, onClick }, i) => (
                      <MenuItem onClick={onClick} key={i}>
                        <MenuIcon mr={4}>{icon}</MenuIcon>
                        {label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
              <Image
                flex={1}
                src={emptyLogicTabImage}
                height={{ base: '257px', lg: 'auto' }}
                mb={{ base: '24px', lg: '0px' }}
              />
            </VStack>
          </Center>
        )}
        {config.operations.map(renderOperation)}
      </VStack>
    </>
  )
}
