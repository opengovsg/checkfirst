import React, { FC, useEffect } from 'react'
import { BiCog, BiDuplicate, BiTrash } from 'react-icons/bi'
import {
  useMultiStyleConfig,
  StylesProvider,
  Flex,
  HStack,
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

type BuilderFieldComponent = QuestionFieldComponent | TitleFieldComponent
type BuilderFieldData =
  | checker.Field
  | Pick<checker.Checker, 'title' | 'description'>

const isFieldData = (data: BuilderFieldData): data is checker.Field => {
  return data && (data as checker.Field).type !== undefined
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
  const styles = useMultiStyleConfig('QuestionField', { variant })

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

    const Content = (active
      ? InputComponent
      : PreviewComponent) as TitleFieldComponent
    return <Content {...props} {...data} />
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
    }
  }

  const handleDelete = () => {
    if (isFieldData(data)) {
      dispatch({
        type: BuilderActionEnum.Remove,
        payload: { currIndex: index, configArrName: ConfigArrayEnum.Fields },
      })
      setActiveIndex(index - 1)
    }
  }

  return (
    <Flex
      ref={ref}
      sx={styles.container}
      direction="column"
      onClick={handleSelect}
    >
      <StylesProvider value={styles}>
        <Flex>{renderContent()}</Flex>
        {active && (
          <HStack justifyContent="flex-end">
            <ActionButton aria-label="Settings" icon={<BiCog />} />
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
      </StylesProvider>
    </Flex>
  )
}
