import React, { FC, useEffect } from 'react'
import { BiCog, BiDuplicate, BiTrash } from 'react-icons/bi'
import {
  useMultiStyleConfig,
  useStyles,
  IconButtonProps,
  StylesProvider,
  IconButton,
  Flex,
  HStack,
} from '@chakra-ui/react'

import * as checker from '../../../types/checker'
import { usePosition } from '../../hooks/use-position'

interface TitleFieldData {
  title: string
  description: string
  index: number
}
export type TitleFieldComponent = FC<TitleFieldData>

interface QuestionFieldProps {
  id: string
  active?: boolean
  data: checker.Field | TitleFieldData
  onSelect: ({ index }: { index: number }) => void
  onActive: ({ top }: { top: number }) => void
}

interface QuestionFieldComponentProps {
  field: checker.Field
}
export type QuestionFieldComponent = FC<QuestionFieldComponentProps>

const ActionButton: FC<IconButtonProps> = (props) => {
  const styles = useStyles()
  return <IconButton {...props} variant="link" sx={styles.action} />
}

const isFieldData = (
  data: checker.Field | TitleFieldData
): data is checker.Field => {
  return data && (data as checker.Field).type !== undefined
}

export const createQuestionField = (
  InputComponent: QuestionFieldComponent | TitleFieldComponent,
  PreviewComponent: QuestionFieldComponent | TitleFieldComponent
): FC<QuestionFieldProps> => ({
  id,
  active,
  data,
  onSelect,
  onActive,
  ...props
}) => {
  const [ref, { top }] = usePosition()
  const variant = active ? 'active' : ''
  const styles = useMultiStyleConfig('QuestionField', { variant })

  useEffect(() => {
    if (active) onActive({ top })
  }, [active, onActive, top])

  const handleSelect = () => {
    if (!active && onSelect) onSelect({ id })
  }

  const renderContent = () => {
    if (isFieldData(data)) {
      const Content = (active
        ? InputComponent
        : PreviewComponent) as QuestionFieldComponent
      return <Content {...props} field={data} />
    }

    const Content = (active
      ? InputComponent
      : PreviewComponent) as TitleFieldComponent
    return <Content {...props} {...data} />
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
            <ActionButton aria-label="Duplicate" icon={<BiDuplicate />} />
            <ActionButton aria-label="Delete" icon={<BiTrash />} />
          </HStack>
        )}
      </StylesProvider>
    </Flex>
  )
}
