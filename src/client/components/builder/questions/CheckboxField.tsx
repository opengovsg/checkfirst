import React from 'react'
import { BiPlus, BiSelectMultiple, BiTrash } from 'react-icons/bi'
import {
  Button,
  IconButton,
  HStack,
  VStack,
  Text,
  Input,
  Checkbox,
  CheckboxGroup,
  useStyles,
  InputGroup,
  InputLeftElement,
  useMultiStyleConfig,
  Icon,
  Flex,
} from '@chakra-ui/react'

import * as checker from '../../../../types/checker'
import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'

import '../../../styles/big-checkbox.css'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const { dispatch } = useCheckerContext()
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('CheckboxField', {})

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
        <Checkbox
          sx={styles.checkbox}
          className="big-checkbox"
          isChecked={false}
        />
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
          variant="link"
          icon={<BiTrash />}
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
          children={<BiSelectMultiple />}
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

const PreviewComponent: QuestionFieldComponent = ({ field }) => {
  const { title, description, options } = field
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('CheckboxField', {})

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={2}>
      <VStack sx={commonStyles.fullWidthContainer} spacing={0}>
        <HStack>
          <BiSelectMultiple fontSize="20px" />
          <Text sx={commonStyles.previewTitle}>{title}</Text>
        </HStack>
        {description && (
          <Text sx={commonStyles.previewDescription}>{description}</Text>
        )}
      </VStack>
      <CheckboxGroup>
        <VStack sx={styles.previewOptionsContainer} spacing={0}>
          {options.map(({ value, label }, i) => (
            <Flex key={i} sx={styles.previewOptionRowContainer}>
              <Checkbox
                sx={styles.checkbox}
                className="big-checkbox"
                spacing={4}
                value={value}
                isChecked={false}
              >
                <Text sx={styles.checkboxText}>{label}</Text>
              </Checkbox>
            </Flex>
          ))}
        </VStack>
      </CheckboxGroup>
    </VStack>
  )
}

export const CheckboxField = createBuilderField(
  InputComponent,
  PreviewComponent
)
