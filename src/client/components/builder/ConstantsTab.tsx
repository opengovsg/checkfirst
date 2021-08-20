import React, { FC, useEffect, useState } from 'react'
import {
  BiPlus,
  BiPlusCircle,
  BiUpArrowAlt,
  BiDownArrowAlt,
} from 'react-icons/bi'
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Center,
  Image,
  Link,
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
import useActiveIndex from '../../hooks/use-active-index'

// Images
import emptyConstantsTabImage from '../../assets/states/empty-constants.svg'

const CONSTANTS_GUIDE_URL = 'https://go.gov.sg/checkfirst-constants'

const generateDefaultMap = (id: number): checker.Constant => ({
  id: `T${id}`,
  title: 'Insert map title',
  table: [{ key: '', value: NaN }],
})

export const ConstantsTab: FC = () => {
  const { config, dispatch, checkHasChanged } = useCheckerContext()
  const { constants } = config

  const [activeIndex, setActiveIndex] = useActiveIndex(constants)
  const [offsetTop, setOffsetTop] = useState<number>(16)
  const [nextUniqueId, setNextUniqueId] = useState<number>(1)

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
    checkHasChanged(() => setActiveIndex(index))
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
    <>
      <VStack align="stretch" position="relative" spacing={4}>
        {config.constants.length > 0 ? (
          <>
            <FloatingToolbar offsetTop={offsetTop} options={toolbarOptions} />
            <Alert status="info">
              <AlertIcon />
              <AlertDescription>
                Constants can only be numeric values. To map constants to
                options of a question, ensure that the reference is the same as
                the option.
              </AlertDescription>
            </Alert>
            {constants.map(renderMap)}
          </>
        ) : (
          <Center py={16}>
            <VStack spacing={4} w="100%">
              <Text textStyle="heading2" color="primary.500">
                Give each option a numeric value
              </Text>
              <Text textAlign="center">
                With constant tables, you can assign a number to different
                options of a radio question. <br />
                Especially useful when trying to make calculations based off a
                user’s choice. <br />
                <Link href={CONSTANTS_GUIDE_URL} isExternal color="primary.500">
                  Learn how to work with constants
                </Link>
              </Text>
              <Box pt="16px" pb="32px">
                <Menu placement="bottom">
                  <MenuButton
                    leftIcon={<BiPlus />}
                    as={Button}
                    colorScheme="primary"
                    onClick={addInitialMap}
                  >
                    Add constant table
                  </MenuButton>
                </Menu>
              </Box>
              <Image
                flex={1}
                src={emptyConstantsTabImage}
                height={{ base: '257px', lg: 'auto' }}
                mb={{ base: '24px', lg: '0px' }}
              />
            </VStack>
          </Center>
        )}
      </VStack>
    </>
  )
}
