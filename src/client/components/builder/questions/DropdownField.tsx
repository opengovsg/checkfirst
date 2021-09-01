import React, { useEffect } from 'react'
import { IoIosArrowDropdown } from 'react-icons/io'
import {
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Textarea,
  useStyles,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'

import * as checker from '../../../../types/checker'
import { useCheckerContext } from '../../../contexts'
import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { TitlePreviewText } from './TitlePreviewText'
import { ToolbarPortal } from '../ToolbarPortal'
import { useStyledToast } from '../../common/StyledToast'

const InputComponent: QuestionFieldComponent = ({ field, index, toolbar }) => {
  const { title, description, options } = field
  const { setChanged, isChanged, dispatch, save } = useCheckerContext()
  const commonStyles = useStyles()
  const toast = useStyledToast()

  const { handleSubmit, register, formState, control, reset } = useForm<
    Omit<checker.Field, 'id' | 'type'>
  >({
    defaultValues: {
      title,
      description,
      ...(options && options.length > 0 ? { options } : {}),
    },
  })
  useEffect(() => {
    setChanged(Object.keys(formState.dirtyFields).length > 0)
  }, [formState, setChanged])

  const handleSave = () => {
    handleSubmit(
      ({ title, description, options }) => {
        dispatch(
          {
            type: BuilderActionEnum.Update,
            payload: {
              currIndex: index,
              element: { ...field, title, description, options },
              configArrName: ConfigArrayEnum.Fields,
            },
          },
          () => {
            reset(
              { title, description, options },
              { keepValues: true, keepDirty: false }
            )
            toast({
              status: 'success',
              description: 'Dropdown question updated',
            })
          }
        )
      },
      () => {
        toast({
          status: 'error',
          description: 'Unable to save dropdown question',
        })
      }
    )()
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<IoIosArrowDropdown />}
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
      <VStack sx={commonStyles.halfWidthContainer} spacing={4}>
        <Controller
          name="options"
          control={control}
          rules={{
            validate: (options) =>
              (options && options.length > 0) ||
              'At least one option is required for dropdown',
          }}
          render={({
            field: { name, value, onChange, ref },
            fieldState: { invalid, error },
          }) => {
            return (
              <>
                <Textarea
                  sx={commonStyles.fieldInput}
                  placeholder="Enter each option on a new line"
                  name={name}
                  ref={ref}
                  value={value.map((o) => o.label).join('\n')}
                  onChange={({ target: { value: text } }) => {
                    onChange(
                      text
                        ? text
                            .split('\n')
                            .map((label, value) => ({ label, value }))
                        : []
                    )
                  }}
                  isInvalid={invalid}
                />
                <Text fontSize="sm" color="error.500">
                  {error?.message}
                </Text>
              </>
            )
          }}
        />
      </VStack>
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
  const { title, description, options } = field
  const commonStyles = useStyles()

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={3}>
      <VStack sx={commonStyles.fullWidthContainer} spacing={0}>
        <TitlePreviewText index={index}>{title}</TitlePreviewText>
        {description && (
          <Text sx={commonStyles.previewDescription}>{description}</Text>
        )}
      </VStack>
      <Select isDisabled sx={commonStyles.dummyInput}>
        {options.map(({ value, label }, i) => (
          <option key={i} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </VStack>
  )
}

export const DropdownField = createBuilderField(
  InputComponent,
  PreviewComponent
)
