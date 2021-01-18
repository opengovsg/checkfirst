import React, { FC, useState } from 'react'
import { Container, Heading, Divider, Stack, Button } from '@chakra-ui/react'
import { useForm, FormProvider } from 'react-hook-form'

import { Checkbox, Radio, Numeric, DateField } from './fields'
import { TextDisplay, ButtonDisplay } from './displays'
import * as checker from './../../types/checker'
import { variableReducer } from './../core/evaluator'

interface CheckerProps {
  config: checker.Checker
}

interface VariableResults {
  [key: string]: any
}

export const Checker: FC<CheckerProps> = ({ config }) => {
  const methods = useForm()
  const { title, fields, operations, constants, displays } = config
  const [variables, setVariables] = useState<VariableResults>({})

  const renderField = (field: checker.Field, i: number) => {
    switch (field.type) {
      case 'NUMERIC':
        return <Numeric key={i} order={i} {...field} />
      case 'CHECKBOX':
        return <Checkbox key={i} order={i} {...field} />
      case 'RADIO':
        return <Radio key={i} order={i} {...field} />
      case 'DATE':
        return <DateField key={i} order={i} {...field} />
    }
  }

  const renderDisplay = (display: checker.Display, i: number) => {
    const values = display.targets.map((output) => variables[output])
    switch (display.type) {
      case 'TEXT':
        return <TextDisplay key={i} content={values[0]} {...display} />
      case 'BUTTON':
        return (
          <ButtonDisplay
            key={i}
            buttonText={values[0]}
            buttonUrl={values[1]}
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
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Container maxW="3xl" layerStyle="card">
            <Heading textAlign="center">{title}</Heading>
            <Divider my={8} />
            <Stack direction="column" spacing={9} textStyle="body-1">
              {fields.map(renderField)}
            </Stack>
            <Divider my={8} />
            <Button colorScheme="primary" width="100%" type="submit">
              Submit
            </Button>
          </Container>
        </form>
      </FormProvider>
      {Object.keys(variables).length > 0 && (
        <Container maxW="3xl" layerStyle="card">
          <Stack direction="column" spacing={9} textStyle="body-1">
            {displays.map(renderDisplay)}
          </Stack>
        </Container>
      )}
      <>
        {Object.entries(variables).map(([key, value]) => (
          <div>
            {key}: {value}
          </div>
        ))}
      </>
    </>
  )
}
