import React, { FC, useEffect } from 'react'
import { BiDuplicate, BiTrash, BiShow, BiHide } from 'react-icons/bi'
import {
  useMultiStyleConfig,
  StylesProvider,
  Flex,
  HStack,
  Button,
} from '@chakra-ui/react'

import { useCheckerContext } from '../../contexts'
import * as checker from '../../../types/checker'
import { usePosition } from '../../hooks/use-position'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../util/enums'
import { ActionButton } from '../builder'

export type TitleFieldComponent = FC<
  Pick<checker.Checker, 'title' | 'description'>
>

interface QuestionFieldComponentProps {
  field: checker.Field
  index: number
}
export type QuestionFieldComponent = FC<QuestionFieldComponentProps>

interface OperationFieldComponentProps {
  operation: checker.Operation
  index: number
}
export type OperationFieldComponent = FC<OperationFieldComponentProps>

interface ConstantFieldComponentProps {
  constant: checker.Constant
  index: number
}
export type ConstantFieldComponent = FC<ConstantFieldComponentProps>

type BuilderFieldComponent =
  | QuestionFieldComponent
  | TitleFieldComponent
  | OperationFieldComponent
  | ConstantFieldComponent

type BuilderFieldData =
  | checker.Field
  | checker.Operation
  | checker.Constant
  | Pick<checker.Checker, 'title' | 'description'>

const isFieldData = (data: BuilderFieldData): data is checker.Field => {
  return data && (data as checker.Field).options !== undefined
}

const isOperationData = (data: BuilderFieldData): data is checker.Operation => {
  return data && (data as checker.Operation).expression !== undefined
}

const isConstantData = (data: BuilderFieldData): data is checker.Constant => {
  return data && (data as checker.Constant).table !== undefined
}

interface BuilderFieldProps {
  id: string
  index: number
  active?: boolean
  data: BuilderFieldData
  nextUniqueId: number
  onSelect: ({ index }: { index: number }) => void
  onActive: ({ top }: { top: number }) => void
  setActiveIndex: (index: number) => void
  setNextUniqueId: (index: number) => void
}

export const createBuilderField = (
  InputComponent: BuilderFieldComponent,
  PreviewComponent: BuilderFieldComponent
): FC<BuilderFieldProps> => ({
  index,
  active,
  data,
  onSelect,
  onActive,
  setActiveIndex,
  nextUniqueId,
  setNextUniqueId,
  ...props
}) => {
  const [ref, { top }] = usePosition()
  const { dispatch } = useCheckerContext()
  const variant = active ? 'active' : ''
  const styles = useMultiStyleConfig('BuilderField', { variant })

  useEffect(() => {
    if (active) onActive({ top })
  }, [active, onActive, top])

  const handleSelect = () => {
    if (!active && onSelect) onSelect({ index })
  }

  const renderContent = () => {
    if (isFieldData(data)) {
      const Content = (active
        ? InputComponent
        : PreviewComponent) as QuestionFieldComponent
      return <Content {...props} field={data} index={index} />
    }

    if (isConstantData(data)) {
      const Content = (active
        ? InputComponent
        : PreviewComponent) as ConstantFieldComponent
      return <Content {...props} constant={data} index={index} />
    }

    if (isOperationData(data)) {
      const Content = (active
        ? InputComponent
        : PreviewComponent) as OperationFieldComponent
      return <Content {...props} operation={data} index={index} />
    }

    const Content = (active
      ? InputComponent
      : PreviewComponent) as TitleFieldComponent
    return (
      <Content
        {...props}
        {...(data as Pick<checker.Checker, 'title' | 'description'>)}
      />
    )
  }

  const getConfigArrName = (data: BuilderFieldData) => {
    if (isConstantData(data)) return ConfigArrayEnum.Constants
    if (isFieldData(data)) return ConfigArrayEnum.Fields
    if (isOperationData(data)) return ConfigArrayEnum.Operations
  }

  const handleDuplicate = () => {
    if (isFieldData(data)) {
      const [prefix] = data.id.match(/^[^\d]+/) || []
      const updatedData = {
        ...data,
        id: `${prefix}${nextUniqueId}`,
      }
      dispatch({
        type: BuilderActionEnum.Add,
        payload: {
          element: updatedData,
          configArrName: ConfigArrayEnum.Fields,
          newIndex: index + 1,
        },
      })
      setActiveIndex(index + 1)
      setNextUniqueId(nextUniqueId + 1)
    } else if (isOperationData(data)) {
      const updatedData = {
        ...data,
        id: `${data.id[0]}${nextUniqueId}`,
      }
      dispatch({
        type: BuilderActionEnum.Add,
        payload: {
          element: updatedData,
          configArrName: ConfigArrayEnum.Operations,
          newIndex: index + 1,
        },
      })
      setActiveIndex(index + 1)
      setNextUniqueId(nextUniqueId + 1)
    } else if (isConstantData(data)) {
      const updatedData = {
        ...data,
        id: `${data.id[0]}${nextUniqueId}`,
      }
      dispatch({
        type: BuilderActionEnum.Add,
        payload: {
          element: updatedData,
          configArrName: ConfigArrayEnum.Constants,
          newIndex: index + 1,
        },
      })
      setActiveIndex(index + 1)
      setNextUniqueId(nextUniqueId + 1)
    }
  }

  const handleDelete = () => {
    // adding the ! assert because only valid ConfigArrayEnum cards have the delete button
    const configArrName: ConfigArrayEnum = getConfigArrName(data)!

    dispatch({
      type: BuilderActionEnum.Remove,
      payload: {
        currIndex: index,
        configArrName,
      },
    })
    setActiveIndex(index - 1)
  }

  const handleDisplayToggle = () => {
    if (isOperationData(data)) {
      dispatch({
        type: BuilderActionEnum.Update,
        payload: {
          currIndex: index,
          configArrName: ConfigArrayEnum.Operations,
          element: {
            ...data,
            show: !data.show,
          },
        },
      })
    }
  }

  return (
    <StylesProvider value={styles}>
      <Flex
        ref={ref}
        sx={styles.container}
        direction="column"
        onClick={handleSelect}
      >
        {(isFieldData(data) ||
          isOperationData(data) ||
          isConstantData(data)) && (
          <Button colorScheme="primary" sx={styles.badge}>
            {data.id}
          </Button>
        )}
        <Flex sx={styles.content}>{renderContent()}</Flex>
        {active && (
          <HStack justifyContent="flex-end">
            {isOperationData(data) && (
              <ActionButton
                aria-label="Duplicate"
                icon={data.show ? <BiShow /> : <BiHide />}
                onClick={handleDisplayToggle}
              />
            )}
            <ActionButton
              aria-label="Duplicate"
              icon={<BiDuplicate />}
              onClick={handleDuplicate}
            />
            <ActionButton
              aria-label="Delete"
              icon={<BiTrash />}
              onClick={handleDelete}
            />
          </HStack>
        )}
      </Flex>
    </StylesProvider>
  )
}
