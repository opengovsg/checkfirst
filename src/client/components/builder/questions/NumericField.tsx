import React, { useEffect } from 'react'
import { BiHash } from 'react-icons/bi'
import {
  Button,
  useStyles,
  VStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import * as checker from '../../../../types/checker'
import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { TitlePreviewText } from './TitlePreviewText'
import { ToolbarPortal } from '../ToolbarPortal'
import { useStyledToast } from '../../common/StyledToast'

const InputComponent: QuestionFieldComponent = ({ field, index, toolbar }) => {
  const { title, description } = field
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('NumericField', {})
  const toast = useStyledToast()

  const { setChanged, dispatch, save } = useCheckerContext()
  const { handleSubmit, register, formState, reset } = useForm<
    Pick<checker.Field, 'title' | 'description'>
  >({
    defaultValues: {
      title,
      description,
    },
  })
  useEffect(() => {
    setChanged(formState.isDirty)
  }, [formState.isDirty, setChanged])

  const handleSave = () => {
    handleSubmit(
      ({ title, description }) => {
        dispatch(
          {
            type: BuilderActionEnum.Update,
            payload: {
              currIndex: index,
              element: { ...field, title, description },
              configArrName: ConfigArrayEnum.Fields,
            },
          },
          () => {
            reset(
              { title, description },
              { keepValues: true, keepDirty: false }
            )
            toast({
              status: 'success',
              description: 'Numeric question updated',
            })
          }
        )
      },
      () => {
        toast({
          status: 'error',
          description: 'Unable to save numeric question',
        })
      }
    )()
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiHash />}
        />
        <Input
          type="text"
          sx={commonStyles.fieldInput}
          placeholder="Question"
          {...register('title', {
            required: { value: true, message: 'Title cannot be empty' },
          })}
          isInvalid={!!formState.errors.title}
        />
      </InputGroup>
      <Text fontSize="sm" color="error.500">
        {formState.errors.title?.message}
      </Text>
      <Input
        type="text"
        sx={commonStyles.fieldInput}
        placeholder="Description"
        {...register('description')}
      />
      <Input
        type="text"
        placeholder="Enter number"
        sx={{ ...commonStyles.dummyInput, ...styles.numericInput }}
        disabled
      />
      <ToolbarPortal container={toolbar}>
        <Button
          isLoading={save.isLoading}
          colorScheme="primary"
          onClick={handleSave}
        >
          Save
        </Button>
      </ToolbarPortal>
    </VStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('NumericField', {})

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={3}>
      <VStack sx={commonStyles.fullWidthContainer} spacing={0}>
        <TitlePreviewText index={index}>{title}</TitlePreviewText>
        {description && (
          <Text sx={commonStyles.previewDescription}>{description}</Text>
        )}
      </VStack>
      <Input
        type="text"
        placeholder="Enter number"
        sx={{ ...commonStyles.dummyInput, ...styles.numericInput }}
        disabled
      />
    </VStack>
  )
}

export const NumericField = createBuilderField(InputComponent, PreviewComponent)
