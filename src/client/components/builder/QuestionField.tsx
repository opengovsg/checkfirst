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

interface QuestionFieldProps {
  active?: boolean
  field: checker.Field
  onSelect: ({ id }: { id: string }) => void
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

export const createQuestionField = (
  InputComponent: QuestionFieldComponent,
  PreviewComponent: QuestionFieldComponent
): FC<QuestionFieldProps> => ({
  active,
  field,
  onSelect,
  onActive,
  ...props
}) => {
  const [ref, { top }] = usePosition()
  const Content = active ? InputComponent : PreviewComponent
  const variant = active ? 'active' : ''
  const styles = useMultiStyleConfig('QuestionField', { variant })

  useEffect(() => {
    if (active) onActive({ top })
  }, [active, onActive, top])

  const handleSelect = () => {
    if (!active && onSelect) onSelect({ id: field.id })
  }

  return (
    <Flex
      ref={ref}
      sx={styles.container}
      direction="column"
      onClick={handleSelect}
    >
      <StylesProvider value={styles}>
        <Flex>
          <Content {...props} field={field} />
        </Flex>
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
