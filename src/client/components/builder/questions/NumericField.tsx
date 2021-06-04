import React from 'react'
import { BiHash } from 'react-icons/bi'
import {
  useStyles,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  useMultiStyleConfig,
} from '@chakra-ui/react'

import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { FieldIndexText } from './FieldIndexText'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('NumericField', {})

  const { dispatch } = useCheckerContext()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          name="title"
          onChange={handleChange}
          value={title}
        />
      </InputGroup>
      <Input
        type="text"
        sx={commonStyles.fieldInput}
        name="description"
        placeholder="Description"
        onChange={handleChange}
        value={description}
      />
      <Input
        type="text"
        placeholder="Enter number"
        sx={{ ...commonStyles.dummyInput, ...styles.numericInput }}
        disabled
      />
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
        <HStack>
          <FieldIndexText index={index} />
          <Text sx={commonStyles.previewTitle}>{title}</Text>
        </HStack>
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
