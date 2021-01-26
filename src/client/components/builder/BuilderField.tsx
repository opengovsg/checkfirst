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

type BuilderFieldComponent =
  | QuestionFieldComponent
  | TitleFieldComponent
  | OperationFieldComponent

type BuilderFieldData =
  | checker.Field
  | checker.Operation
  | Pick<checker.Checker, 'title' | 'description'>

const isFieldData = (data: BuilderFieldData): data is checker.Field => {
  return data && (data as checker.Field).options !== undefined
}

const isOperationData = (data: BuilderFieldData): data is checker.Operation => {
  return data && (data as checker.Operation).expression !== undefined
}

interface BuilderFieldProps {
  id: string
  index: number
  active?: boolean
  data: BuilderFieldData
  onSelect: ({ index }: { index: number }) => void
  onActive: ({ top }: { top: number }) => void
  setActiveIndex: (index: number) => void
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

  const handleDuplicate = () => {
    if (isFieldData(data)) {
      dispatch({
        type: BuilderActionEnum.Add,
        payload: {
          element: data,
          configArrName: ConfigArrayEnum.Fields,
          newIndex: index + 1,
        },
      })
      setActiveIndex(index + 1)
    } else if (isOperationData(data)) {
      dispatch({
        type: BuilderActionEnum.Add,
        payload: {
          element: data,
          configArrName: ConfigArrayEnum.Operations,
          newIndex: index + 1,
        },
      })
    }
  }

  const handleDelete = () => {
    dispatch({
      type: BuilderActionEnum.Remove,
      payload: {
        currIndex: index,
        configArrName: isFieldData(data)
          ? ConfigArrayEnum.Fields
          : ConfigArrayEnum.Operations,
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
        {(isFieldData(data) || isOperationData(data)) && (
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
