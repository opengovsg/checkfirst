import React, { FC, useEffect, useState } from 'react'
import { BiPlusCircle, BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi'
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  Heading,
  Text,
  VStack,
  Button,
  Menu,
  MenuButton,
} from '@chakra-ui/react'

import * as checker from '../../../types/checker'
import { FloatingToolbar } from './FloatingToolbar'
import { MapTable } from './constants'

import { useCheckerContext } from '../../contexts'

import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'

const generateDefaultMap = (id: number): checker.Constant => ({
  id: `T${id}`,
  title: 'Insert map title',
  table: [{ key: '', value: NaN }],
})

export const ConstantsTab: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [offsetTop, setOffsetTop] = useState<number>(16)
  const [nextUniqueId, setNextUniqueId] = useState<number>(1)
  const { config, dispatch } = useCheckerContext()

  const { constants } = config

  useEffect(() => {
    let highestIndex = 0
    config.constants.forEach((constant) => {
      const constantIndex = parseInt(constant.id.slice(1))
      highestIndex = Math.max(highestIndex, constantIndex)
    })
    setNextUniqueId(highestIndex + 1)
  }, [config])

  const toolbarOptions = [
    {
      icon: <BiPlusCircle />,
      label: 'Add map',
      onClick: () => {
        dispatch({
          type: BuilderActionEnum.Add,
          payload: {
            element: generateDefaultMap(nextUniqueId),
            configArrName: ConfigArrayEnum.Constants,
            newIndex: activeIndex + 1,
          },
        })
        setActiveIndex(activeIndex + 1)
        setNextUniqueId(nextUniqueId + 1)
      },
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
            configArrName: ConfigArrayEnum.Constants,
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
            configArrName: ConfigArrayEnum.Constants,
          },
        })
        setActiveIndex(activeIndex + 1)
      },
      disabled: activeIndex === constants.length - 1,
    },
  ]

  const onSelect = ({ index }: { index: number }) => {
    setActiveIndex(index)
  }

  const onActive = ({ top }: { top: number }) => {
    setOffsetTop(top)
  }

  const addInitialMap = () => {
    dispatch({
      type: BuilderActionEnum.Add,
      payload: {
        element: generateDefaultMap(nextUniqueId),
        configArrName: ConfigArrayEnum.Constants,
        newIndex: 1,
      },
    })
    setActiveIndex(0)
    setNextUniqueId(1)
  }

  const renderMap = (constant: checker.Constant, index: number) => {
    const commonProps = {
      key: constant.id + index,
      id: constant.id,
      active: activeIndex === index,
      data: constant,
      index,
      onActive,
      onSelect,
      setActiveIndex,
      nextUniqueId,
      setNextUniqueId,
    }
    return <MapTable {...commonProps} />
  }

  return (
    <VStack align="stretch" position="relative" spacing={4}>
      {config.constants.length > 0 ? (
        <>
          <FloatingToolbar offsetTop={offsetTop} options={toolbarOptions} />
          <Alert status="info">
            <AlertIcon />
            <AlertDescription>
              Constants can only be numeric values. To map constants to options
              of a question, ensure that the reference is the same as the
              option.
            </AlertDescription>
          </Alert>
        </>
      ) : (
        <Center py={16}>
          <VStack spacing={6}>
            <VStack spacing={4}>
              <Heading size="md">No constants found</Heading>
              <Text>Create a new map to begin defining your constants</Text>
            </VStack>
            <Menu placement="bottom">
              <MenuButton
                as={Button}
                colorScheme="primary"
                onClick={addInitialMap}
              >
                Add map
              </MenuButton>
            </Menu>
          </VStack>
        </Center>
      )}
      {constants.map(renderMap)}
    </VStack>
  )
}
