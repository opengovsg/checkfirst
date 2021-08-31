import React, { useEffect } from 'react'
import { BiPlus, BiRadioCircleMarked, BiTrash } from 'react-icons/bi'
import {
  Button,
  IconButton,
  HStack,
  VStack,
  Text,
  Input,
  Radio,
  RadioGroup,
  InputGroup,
  InputLeftElement,
  useMultiStyleConfig,
  useStyles,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { useForm, useFieldArray } from 'react-hook-form'

import * as checker from '../../../../types/checker'
import { useCheckerContext } from '../../../contexts'
import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { TitlePreviewText } from './TitlePreviewText'
import { ToolbarPortal } from '../ToolbarPortal'
import { useStyledToast } from '../../common/StyledToast'

import '../../../styles/builder-field.css'

const InputComponent: QuestionFieldComponent = ({ field, index, toolbar }) => {
  const { title, description, options: initialOptions } = field
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('RadioField', {})
  const toast = useStyledToast()

  const { setChanged, dispatch, save } = useCheckerContext()
  const { register, control, formState, reset, handleSubmit } = useForm<
    Omit<checker.Field, 'id' | 'type'>
  >({
    defaultValues: {
      title: title || '',
      description: description || '',
      ...(initialOptions && initialOptions.length > 0
        ? { options: initialOptions }
        : {}),
    },
  })
  const {
    fields: options,
    append,
    remove,
  } = useFieldArray<Omit<checker.Field, 'id' | 'type'>>({
    name: 'options',
    control,
  })
  useEffect(() => {
    setChanged(Object.keys(formState.dirtyFields).length > 0)
  }, [formState, setChanged])

  const deleteOption = (i: number) => {
    remove(i)
  }

  const addOption = () => {
    const newOptionLabel = `Option ${field.options.length + 1}`
    // newValue is an increment of the last option's value to ensure that values are unique
    const newValue = field.options[field.options.length - 1].value + 1
    const newOption = { label: newOptionLabel, value: newValue }
    append(newOption)
  }

  const renderOption = (_: checker.FieldOption, i: number) => {
    return (
      <HStack key={i} spacing={4}>
        <Radio sx={styles.radio} isChecked={false} />
        <Input
          type="text"
          {...register(`options.${i}.label`, {
            required: { value: true, message: 'Option value cannot be empty' },
          })}
          isInvalid={
            !!(
              formState.errors.options &&
              formState.errors.options[i]?.label?.message
            )
          }
        />
        <IconButton
          sx={styles.deleteOptionButton}
          colorScheme="error"
          aria-label="Delete option"
          icon={<BiTrash />}
          variant="link"
          disabled={field.options.length <= 1}
          onClick={() => deleteOption(i)}
        />
      </HStack>
    )
  }

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
              description: 'Radio question updated',
            })
          }
        )
      },
      () => {
        toast({
          status: 'error',
          description: 'Unable to save radio question',
        })
      }
    )()
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiRadioCircleMarked />}
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
        {options.map(renderOption)}
        <HStack sx={styles.addOptionContainer} spacing={4}>
          <Icon as={BiPlus} sx={styles.addOptionIcon} />
          <Button
            variant="link"
            sx={styles.addOptionButton}
            onClick={addOption}
          >
            Add option
          </Button>
        </HStack>
      </VStack>
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
  const { title, description, options } = field
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('RadioField', {})

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={2}>
      <VStack sx={commonStyles.fullWidthContainer} spacing={0}>
        <TitlePreviewText index={index}>{title}</TitlePreviewText>
        {description && (
          <Text sx={commonStyles.previewDescription}>{description}</Text>
        )}
      </VStack>
      <RadioGroup>
        <VStack sx={styles.previewOptionsContainer} spacing="24px">
          {options.map(({ value, label }, i) => (
            <Flex
              key={i}
              sx={styles.previewOptionRowContainer}
              className="builder-field"
            >
              <Radio
                sx={styles.radio}
                spacing={4}
                value={value}
                isChecked={false}
              >
                <Text sx={styles.radioText}>{label}</Text>
              </Radio>
            </Flex>
          ))}
        </VStack>
      </RadioGroup>
    </VStack>
  )
}

export const RadioField = createBuilderField(InputComponent, PreviewComponent)
