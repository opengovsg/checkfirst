import React from 'react'
import {
  VStack,
  Text,
  Input,
  useStyles,
  useMultiStyleConfig,
  Textarea,
} from '@chakra-ui/react'

import { createBuilderField, TitleFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum } from '../../../../util/enums'

const enum SettingsName {
  description = 'description',
  title = 'title',
}

const InputComponent: TitleFieldComponent = ({ title, description }) => {
  const { dispatch } = useCheckerContext()
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('TitleField', {})

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const update = { settingsName: name as SettingsName, value }

    dispatch({
      type: BuilderActionEnum.UpdateSettings,
      payload: update,
    })
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <Input
        type="text"
        sx={commonStyles.fieldInput}
        name={SettingsName.title}
        placeholder="Title"
        onChange={handleChange}
        value={title}
      />
      <Textarea
        type="text"
        sx={styles.descriptionTextarea}
        name={SettingsName.description}
        placeholder="Description"
        onChange={handleChange}
        value={description}
      />
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
