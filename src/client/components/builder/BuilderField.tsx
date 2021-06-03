import React, { FC, useEffect } from 'react'
import { difference } from 'lodash'
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
import { BuilderAddPayload } from '../../../types/builder'
import { DefaultTooltip } from '../common/DefaultTooltip'

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

const isTitleData = (
  data: BuilderFieldData
): data is Pick<checker.Checker, 'title' | 'description'> => {
  return (
    data && difference(Object.keys(data), ['title', 'description']).length === 0
  )
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

export const createBuilderField =
  (
    InputComponent: BuilderFieldComponent,
    PreviewComponent: BuilderFieldComponent
  ): FC<BuilderFieldProps> =>
  ({
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
    const colorScheme = !active
      ? 'inactive'
      : isFieldData(data) || isTitleData(data)
      ? 'success'
      : isConstantData(data)
      ? 'warning'
      : isOperationData(data)
      ? 'primary'
      : 'primary' // fallback
    const styles = useMultiStyleConfig('BuilderField', { variant, colorScheme })

    useEffect(() => {
      if (active) onActive({ top })
    }, [active, onActive, top])

    const handleSelect = () => {
      if (!active && onSelect) onSelect({ index })
    }

    const renderContent = () => {
      if (isFieldData(data)) {
        const Content = (
          active ? InputComponent : PreviewComponent
        ) as QuestionFieldComponent
        return <Content {...props} field={data} index={index} />
      }

      if (isConstantData(data)) {
        const Content = (
          active ? InputComponent : PreviewComponent
        ) as ConstantFieldComponent
        return <Content {...props} constant={data} index={index} />
      }

      if (isOperationData(data)) {
        const Content = (
          active ? InputComponent : PreviewComponent
        ) as OperationFieldComponent
        return <Content {...props} operation={data} index={index} />
      }

      const Content = (
        active ? InputComponent : PreviewComponent
      ) as TitleFieldComponent
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

    const makeElement = <
      T extends checker.Field | checker.Operation | checker.Constant
    >(
      data: T
    ): T => {
      const [prefix] = data.id.match(/^[^\d]+/) || []
      return {
        // Do a quick and dirty deep copy by serializing
        // and deserializing. Note that this will only work so long
        // as `data` only contains serializable properties
        ...JSON.parse(JSON.stringify(data)),
        id: `${prefix}${nextUniqueId}`,
      }
    }

    const handleDuplicate = () => {
      if (isFieldData(data) || isOperationData(data) || isConstantData(data)) {
        const payload: BuilderAddPayload | undefined = isFieldData(data)
          ? {
              element: makeElement(data),
              configArrName: ConfigArrayEnum.Fields,
              newIndex: index + 1,
            }
          : isOperationData(data)
          ? {
              element: makeElement(data),
              configArrName: ConfigArrayEnum.Operations,
              newIndex: index + 1,
            }
          : isConstantData(data)
          ? {
              element: makeElement(data),
              configArrName: ConfigArrayEnum.Constants,
              newIndex: index + 1,
            }
          : undefined
        if (payload) {
          dispatch({
            type: BuilderActionEnum.Add,
            payload,
          })
          setActiveIndex(index + 1)
          setNextUniqueId(nextUniqueId + 1)
        }
      }
    }

    const handleDelete = () => {
      // adding the ! assert because only valid ConfigArrayEnum cards have the delete button
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
            <Button colorScheme={colorScheme} sx={styles.badge}>
              {data.id}
            </Button>
          )}
          <Flex sx={styles.content}>{renderContent()}</Flex>
          {active && (
            <HStack
              sx={isTitleData(data) ? styles.barSpacer : styles.actionBar}
              spacing={0}
            >
              {isOperationData(data) && (
                <ActionButton
                  aria-label="Duplicate"
                  icon={
                    data.show ? (
                      <DefaultTooltip label="Hide result">
                        <span>
                          <BiShow />
                        </span>
                      </DefaultTooltip>
                    ) : (
                      <DefaultTooltip label="Show result">
                        <span>
                          <BiHide />
                        </span>
                      </DefaultTooltip>
                    )
                  }
                  onClick={handleDisplayToggle}
                />
              )}
              {!isTitleData(data) && (
                <>
                  <ActionButton
                    aria-label="Duplicate"
                    icon={
                      <DefaultTooltip label="Duplicate">
                        <span>
                          <BiDuplicate />
                        </span>
                      </DefaultTooltip>
                    }
                    onClick={handleDuplicate}
                  />
                  <ActionButton
                    colorScheme="error"
                    aria-label="Delete"
                    icon={
                      <DefaultTooltip label="Delete">
                        <span>
                          <BiTrash />
                        </span>
                      </DefaultTooltip>
                    }
                    onClick={handleDelete}
                  />
                </>
              )}
            </HStack>
          )}
        </Flex>
      </StylesProvider>
    )
  }
