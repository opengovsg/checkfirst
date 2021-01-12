import React, { FC } from 'react'
import { Container, Heading, Divider, Stack, Button } from '@chakra-ui/react'
import { useForm, FormProvider } from 'react-hook-form'

import { Checkbox, Radio, Numeric } from './fields'
import * as checker from './../../types/checker'

interface CheckerProps {
  config: checker.Checker
}

export const Checker: FC<CheckerProps> = ({ config }) => {
  const methods = useForm()

  const renderField = (field: checker.Field, i: number) => {
    switch (field.type) {
      case 'NUMERIC':
        return <Numeric key={i} {...field} />
      case 'CHECKBOX':
        return <Checkbox key={i} {...field} />
      case 'RADIO':
        return <Radio key={i} {...field} />
    }
  }

  // TODO: For checkbox and radio since the value is the option index, we need to retrieve the actual value.
  const onSubmit = (data: any) => console.log(data)

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Container maxW="3xl" layerStyle="card">
          <Heading textAlign="center">{config?.title}</Heading>
          <Divider my={8} />
          <Stack direction="column" spacing={9} textStyle="body-1">
            {config.fields.map(renderField)}
          </Stack>
          <Divider my={8} />
          <Button colorScheme="primary" width="100%" type="submit">
            Submit
          </Button>
        </Container>
      </form>
    </FormProvider>
  )
}
