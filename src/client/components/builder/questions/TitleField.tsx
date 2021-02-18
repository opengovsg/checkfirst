import React from 'react'
import { BiText } from 'react-icons/bi'
import { Box, HStack, VStack, Text, Input, Heading } from '@chakra-ui/react'

import { createBuilderField, TitleFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum } from '../../../../util/enums'

const enum SettingsName {
  description = 'description',
  title = 'title',
}

const InputComponent: TitleFieldComponent = ({ title, description }) => {
  const { dispatch } = useCheckerContext()

  const update = (name: string, value: string) => {
    const update = { settingsName: name as SettingsName, value }
    dispatch({
      type: BuilderActionEnum.UpdateSettings,
      payload: update,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    update(name, value)
  }

  const handleTitleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (!value) update(name, 'Title')
  }

  return (
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiText />
      </Box>
      <VStack align="stretch" w="100%">
        <Input
          type="text"
          name={SettingsName.title}
          placeholder="Title"
          onBlur={handleTitleBlur}
          onChange={handleChange}
          value={title}
        />
        <Input
          type="text"
          name={SettingsName.description}
          placeholder="Description"
          onChange={handleChange}
          value={description}
        />
      </VStack>
    </HStack>
  )
}

const PreviewComponent: TitleFieldComponent = ({ title, description }) => {
  return (
    <VStack align="stretch" w="100%">
      <Heading size="lg">{title}</Heading>
      <Text>{description}</Text>
    </VStack>
  )
}

export const TitleField = createBuilderField(InputComponent, PreviewComponent)
