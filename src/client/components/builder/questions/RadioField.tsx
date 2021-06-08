import React from 'react'
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

import * as checker from '../../../../types/checker'
import { useCheckerContext } from '../../../contexts'
import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { FieldIndexText } from './FieldIndexText'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const { dispatch } = useCheckerContext()
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('RadioField', {})

  const updateTitleOrDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, [name]: value },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const deleteOption = (option: checker.FieldOption, i: number) => {
    field.options.splice(i, 1)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, options: field.options },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const updateOption = (
    option: checker.FieldOption,
    update: Partial<checker.FieldOption>,
    i: number
  ) => {
    const updatedOption = { ...option, ...update }
    field.options.splice(i, 1, updatedOption)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, options: field.options },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const addOption = () => {
    const newOptionLabel = `Option ${field.options.length + 1}`
    // newValue is an increment of the last option's value to ensure that values are unique
    const newValue = field.options[field.options.length - 1].value + 1
    const newOption = { label: newOptionLabel, value: newValue }
    field.options.push(newOption)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...field, options: field.options },
        configArrName: ConfigArrayEnum.Fields,
      },
    })
  }

  const renderOption = (option: checker.FieldOption, i: number) => {
    return (
      <HStack key={i} spacing={4}>
        <Radio sx={styles.radio} isChecked={false} />
        <Input
          type="text"
          value={option.label}
          onChange={(e) => {
            updateOption(option, { label: e.target.value }, i)
          }}
        />
        <IconButton
          sx={styles.deleteOptionButton}
          colorScheme="error"
          aria-label="Delete option"
          icon={<BiTrash />}
          variant="link"
          disabled={field.options.length <= 1}
          onClick={() => deleteOption(option, i)}
        />
      </HStack>
    )
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
          name="title"
          placeholder="Question"
          onChange={updateTitleOrDescription}
          value={title}
        />
      </InputGroup>
      <Input
        type="text"
        sx={commonStyles.fieldInput}
        name="description"
        placeholder="Description"
        onChange={updateTitleOrDescription}
        value={description}
      />
      <VStack sx={commonStyles.halfWidthContainer} spacing={4}>
        {field.options.map(renderOption)}
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
        <HStack>
          <FieldIndexText index={index} />
          <Text sx={commonStyles.previewTitle}>{title}</Text>
        </HStack>
        {description && (
          <Text sx={commonStyles.previewDescription}>{description}</Text>
        )}
      </VStack>
      <RadioGroup>
        <VStack sx={styles.previewOptionsContainer} spacing={0}>
          {options.map(({ value, label }, i) => (
            <Flex key={i} sx={styles.previewOptionRowContainer}>
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
