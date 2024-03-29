import React, { useEffect } from 'react'
import { BiCalendar } from 'react-icons/bi'
import {
  Button,
  useStyles,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
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
  const toast = useStyledToast()

  const { setChanged, isChanged, dispatch, save } = useCheckerContext()
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
          children={<BiCalendar />}
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
      <InputGroup sx={commonStyles.halfWidthContainer}>
        <Input
          type="text"
          placeholder="DD/MM/YYYY"
          sx={commonStyles.dummyInput}
          disabled
        />
        <InputRightElement
          pointerEvents="none"
          children={<BiCalendar opacity={0.7} />}
        />
      </InputGroup>
      <ToolbarPortal container={toolbar}>
        <HStack>
          {isChanged && (
            <Button
              isDisabled={save.isLoading}
              colorScheme="primary"
              variant="outline"
              onClick={() => reset(undefined, { keepValues: false })}
            >
              Reset
            </Button>
          )}
          <Button
            isLoading={save.isLoading}
            colorScheme="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </HStack>
      </ToolbarPortal>
    </VStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const commonStyles = useStyles()

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={3}>
      <VStack sx={commonStyles.fullWidthContainer} spacing={0}>
        <TitlePreviewText index={index}>{title}</TitlePreviewText>
        {description && (
          <Text sx={commonStyles.previewDescription}>{description}</Text>
        )}
      </VStack>
      <InputGroup sx={commonStyles.halfWidthContainer}>
        <Input
          type="text"
          placeholder="DD/MM/YYYY"
          sx={commonStyles.dummyInput}
          disabled
        />
        <InputRightElement
          pointerEvents="none"
          children={<BiCalendar opacity={0.7} />}
        />
      </InputGroup>
    </VStack>
  )
}

export const DateField = createBuilderField(InputComponent, PreviewComponent)
