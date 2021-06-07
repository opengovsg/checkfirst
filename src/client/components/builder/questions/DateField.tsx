import React from 'react'
import { BiCalendar } from 'react-icons/bi'
import {
  useStyles,
  Box,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'

import { createBuilderField, QuestionFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'

const InputComponent: QuestionFieldComponent = ({ field, index }) => {
  const { title, description } = field
  const styles = useStyles()
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
    <HStack w="100%" alignItems="flex-start">
      <Box fontSize="20px" pt={2}>
        <BiCalendar />
      </Box>
      <VStack align="stretch" w="90%">
        <Input
          type="text"
          placeholder="Question"
          name="title"
          onChange={handleChange}
          value={title}
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={description}
        />
        <InputGroup w="50%">
          <Input
            type="text"
            placeholder="DD/MM/YYYY"
            sx={styles.dummyInput}
            disabled
          />
          <InputRightElement
            pointerEvents="none"
            children={<BiCalendar opacity={0.7} />}
          />
        </InputGroup>
      </VStack>
    </HStack>
  )
}

const PreviewComponent: QuestionFieldComponent = ({ field }) => {
  const { title, description } = field
  const styles = useStyles()
  return (
    <VStack align="stretch" w="100%" spacing={6}>
      <VStack align="stretch">
        <HStack>
          <BiCalendar fontSize="20px" />
          <Text>{title}</Text>
        </HStack>
        {description && <Text color="secondary.400">{description}</Text>}
      </VStack>
      <InputGroup w="50%">
        <Input
          type="text"
          placeholder="DD/MM/YYYY"
          sx={styles.dummyInput}
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
