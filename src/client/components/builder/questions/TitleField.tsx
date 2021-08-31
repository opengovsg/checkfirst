import React, { useEffect } from 'react'
import {
  Flex,
  Button,
  VStack,
  Text,
  Input,
  useStyles,
  useMultiStyleConfig,
  Textarea,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { createBuilderField, TitleFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum } from '../../../../util/enums'
import { useStyledToast } from '../../common/StyledToast'

const InputComponent: TitleFieldComponent = ({ title, description }) => {
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('TitleField', {})
  const toast = useStyledToast()

  const { setChanged, dispatch, save } = useCheckerContext()
  const { handleSubmit, register, formState, reset, setValue } = useForm<{
    title: string
    description: string
  }>({
    defaultValues: { title, description },
  })
  useEffect(() => {
    setChanged(formState.isDirty)
  }, [formState.isDirty, setChanged])

  useEffect(() => {
    setValue('title', title)
  }, [title, setValue])

  useEffect(() => {
    setValue('description', description || '')
  }, [description, setValue])

  const handleSave = () => {
    handleSubmit(
      ({ title, description }) => {
        dispatch({
          type: BuilderActionEnum.UpdateSettings,
          payload: { title, description },
        })
        reset({ title, description }, { keepValues: true, keepDirty: false })
        toast({
          status: 'success',
          description: 'Updated checker details',
        })
      },
      () => {
        toast({
          status: 'error',
          description: 'Unable to update checker details',
        })
      }
    )()
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <Input
        type="text"
        sx={commonStyles.fieldInput}
        placeholder="Title"
        {...register('title', {
          required: { value: true, message: 'Title cannot be empty' },
        })}
        isInvalid={!!formState.errors.title}
      />
      <Text fontSize="sm" color="error.500">
        {formState.errors.title?.message}
      </Text>
      <Textarea
        type="text"
        sx={styles.descriptionTextarea}
        placeholder="Description"
        {...register('description')}
      />
      <Flex justifyContent="flex-end">
        <Button
          isLoading={save.isLoading}
          colorScheme="primary"
          onClick={handleSave}
        >
          Save
        </Button>
      </Flex>
    </VStack>
  )
}

const PreviewComponent: TitleFieldComponent = ({ title, description }) => {
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('TitleField', {})

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <Text sx={styles.titlePreview}>{title}</Text>
      <Text sx={styles.descriptionPreview}>{description}</Text>
    </VStack>
  )
}

export const TitleField = createBuilderField(InputComponent, PreviewComponent)
