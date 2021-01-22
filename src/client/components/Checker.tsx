import React, { FC, useState } from 'react'
import {
  useMultiStyleConfig,
  StylesProvider,
  Container,
  Heading,
  Stack,
  VStack,
  Button,
  Text,
} from '@chakra-ui/react'
import { useForm, FormProvider } from 'react-hook-form'

import { CheckboxField, RadioField, NumericField, DateField } from './fields'
import { TextDisplay, ButtonDisplay } from './displays'
import * as checker from './../../types/checker'
import { variableReducer } from './../core/evaluator'

interface CheckerProps {
  config: checker.Checker
}

type VariableResults = Record<string, string | number>

export const Checker: FC<CheckerProps> = ({ config }) => {
  const styles = useMultiStyleConfig('Checker', {})
  const methods = useForm()
  const { title, description, fields, operations, constants, displays } = config
  const [variables, setVariables] = useState<VariableResults>({})

  const renderField = (field: checker.Field, i: number) => {
    switch (field.type) {
      case 'NUMERIC':
        return <NumericField key={i} {...field} />
      case 'CHECKBOX':
        return <CheckboxField key={i} {...field} />
      case 'RADIO':
        return <RadioField key={i} {...field} />
      case 'DATE':
        return <DateField key={i} {...field} />
    }
  }

  const renderDisplay = (display: checker.Display, i: number) => {
    const values = display.targets.map((output) => variables[output])
    switch (display.type) {
      case 'TEXT':
        return (
          <TextDisplay key={i} content={values[0] as string} {...display} />
        )
      case 'BUTTON':
        return (
          <ButtonDisplay
            key={i}
            buttonText={values[0] as string}
            buttonUrl={values[1] as string}
            {...display}
          />
        )
    }
  }

  const onSubmit = (inputVariables: Record<string, string | number>) => {
    constants.forEach((constant) => {
      inputVariables[constant.id] = constant.value
    })
    const computedVariables = operations.reduce(variableReducer, inputVariables)
    setVariables(computedVariables)
  }

  return (
    <Container maxW="xl" py={8}>
      <StylesProvider value={styles}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <VStack align="stretch" spacing={10}>
              <VStack spacing={2}>
                <Heading sx={styles.title}>{title}</Heading>
                {description && <Text sx={styles.subtitle}>{description}</Text>}
              </VStack>
              {fields.map(renderField)}
              <Button colorScheme="primary" width="100%" type="submit">
                Submit
              </Button>
            </VStack>
          </form>
        </FormProvider>
        {Object.keys(variables).length > 0 && (
          <Stack direction="column" spacing={9} textStyle="body-1">
            {displays.map(renderDisplay)}
          </Stack>
        )}
      </StylesProvider>
    </Container>
  )
}
