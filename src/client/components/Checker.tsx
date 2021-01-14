import React, { FC, useState } from 'react'
import { Container, Heading, Divider, Stack, Button } from '@chakra-ui/react'
import { useForm, FormProvider } from 'react-hook-form'

import { Checkbox, Radio, Numeric, DateField } from './fields'
import * as checker from './../../types/checker'
import { variableReducer } from './../core/evaluator'

interface CheckerProps {
  config: checker.Checker
}

export const Checker: FC<CheckerProps> = ({ config }) => {
  const methods = useForm()
  const { title, fields, operations } = config
  const [variables, setVariables] = useState({})

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

  const onSubmit = (inputVariables: Record<string, string | number>) => {
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
