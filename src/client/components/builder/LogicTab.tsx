import React, { FC, useEffect, useState } from 'react'
import {
  BiPlusCircle,
  BiCalculator,
  BiGitBranch,
  BiUpArrowAlt,
  BiDownArrowAlt,
} from 'react-icons/bi'
import {
  Center,
  Heading,
  Text,
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
import { CalculatedResult, ConditionalResult } from '../builder/logic'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'

const generateDefaultArithmeticOp = (id: number): checker.Operation => ({
  id: `O${id}`,
  type: 'ARITHMETIC',
  description: 'CalculatedResult',
  expression: '1 + 1',
  show: true,
})

const generateDefaultIfelseOp = (id: number): checker.Operation => ({
  id: `O${id}`,
  type: 'IFELSE',
  description: 'Conditional result',
  expression: 'ifelse(1 > 0, true, false)',
  show: true,
})

export const LogicTab: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [offsetTop, setOffsetTop] = useState<number>(16)
  const [nextUniqueId, setNextUniqueId] = useState<number>(1)
  const { dispatch, config } = useCheckerContext()

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
      label: 'Calculated result',
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
      label: 'Conditional result',
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
    setActiveIndex(index)
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
    }

    switch (op.type) {
      case 'ARITHMETIC':
        return <CalculatedResult {...commonProps} />
      case 'IFELSE':
        return <ConditionalResult {...commonProps} />
    }
  }

  return (
    <VStack align="stretch" position="relative" spacing={4}>
      {config.operations.length > 0 ? (
        <FloatingToolbar offsetTop={offsetTop} options={toolbarOptions} />
      ) : (
        <Center py={16}>
          <VStack spacing={6}>
            <VStack spacing={4}>
              <Heading size="md">No logic found</Heading>
              <Text>
                Select and create a new result to begin defining your logic
              </Text>
            </VStack>
            <Menu placement="bottom">
              <MenuButton as={Button} colorScheme="primary">
                Add result
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
          </VStack>
        </Center>
      )}
      {config.operations.map(renderOperation)}
    </VStack>
  )
}
