import React, { FC, useState, useRef } from 'react'
import { isEmpty, filter } from 'lodash'
import {
  useToast,
  useMultiStyleConfig,
  StylesProvider,
  Container,
  Heading,
  VStack,
  Flex,
  Button,
  Text,
} from '@chakra-ui/react'
import { useForm, FormProvider } from 'react-hook-form'

import {
  CheckboxField,
  RadioField,
  DropdownField,
  NumericField,
  DateField,
} from './fields'
import { LineDisplay } from './displays'
import * as checker from './../../types/checker'
import { evaluate } from './../core/evaluator'
import { unit, Unit } from 'mathjs'
import { useGoogleAnalytics } from '../contexts'
interface CheckerProps {
  config: checker.Checker
}

function isUnit(
  output: string | number | Unit | Record<string, number>
): output is Unit {
  return (output as Unit).toNumber !== undefined
}

export const Checker: FC<CheckerProps> = ({ config }) => {
  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const styles = useMultiStyleConfig('Checker', {})
  const methods = useForm()
  const { title, description, fields, operations, constants } = config
  const [variables, setVariables] = useState<checker.VariableResults>({})
  const googleAnalytics = useGoogleAnalytics()
  const outcomes = useRef<HTMLDivElement | null>(null)

  const renderField = (field: checker.Field, i: number) => {
    switch (field.type) {
      case 'NUMERIC':
        return <NumericField key={i} {...field} />
      case 'CHECKBOX':
        return <CheckboxField key={i} {...field} />
      case 'RADIO':
        return <RadioField key={i} {...field} />
      case 'DROPDOWN':
        return <DropdownField key={i} {...field} />
      case 'DATE':
        return <DateField key={i} {...field} />
    }
  }

  const renderDisplay = (operation: checker.Operation, i: number) => {
    const output = variables[operation.id]

    return (
      operation.show && (
        <LineDisplay
          key={i}
          label={operation.title}
          value={
            isUnit(output)
              ? new Date(output.toNumber('seconds') * 1000).toLocaleString(
                  'default',
                  {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }
                )
              : (output as string)
          }
        />
      )
    )
  }

  const onSubmit = (inputs: Record<string, string | number | Date>) => {
    // Set all numeric inputs to type Number
    const parsedInputs: Record<string, string | number | Unit> = {}

    fields.forEach((field) => {
      const { id, type, options } = field
      if (!inputs[id]) return

      switch (type) {
        case 'NUMERIC': {
          return (parsedInputs[id] = Number(inputs[id]))
        }
        case 'DROPDOWN':
        case 'RADIO': {
          const selected = Number(inputs[id])
          const option = options.find(({ value }) => value === selected)
          if (!option)
            throw new Error(`Unable to find option with value ${selected}`)
          return (parsedInputs[id] = option.label)
        }
        case 'CHECKBOX': {
          const checkboxValues = Object.values(inputs[id]).map(
            (optionIndex) => options[optionIndex].label
          )
          return (parsedInputs[id] = JSON.stringify(checkboxValues))
        }
        case 'DATE': {
          const outputDate = inputs[id] as Date
          const secondsSinceEpoch = Math.round(outputDate.getTime() / 1000)
          return (parsedInputs[id] = unit(`${secondsSinceEpoch} seconds`))
        }
      }
    })

    if (!isCheckerComplete()) {
      toast({
        status: 'warning',
        title: 'No checker logic found',
        description:
          'Results cannot be shown because checker logic is not available.',
      })
    }

    try {
      const computed = evaluate(parsedInputs, constants, operations)
      setVariables(computed)
      outcomes.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    } catch (err) {
      toast({
        status: 'error',
        title: err.name,
        description: err.message,
      })
    }

    googleAnalytics.sendUserEvent(googleAnalytics.GA_USER_EVENTS.SUBMIT)
  }

  // Ensure that at least one operation with `show: true`
  const isCheckerComplete = () => filter(operations, 'show').length > 0

  return (
    <StylesProvider value={styles}>
      <Container maxW="xl" p={8} mb={4} sx={{ overscrollBehavior: 'contain' }}>
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
      </Container>

      {!isEmpty(variables) && isCheckerComplete() && (
        <Flex bg="primary.500" as="div" ref={outcomes} flex={1}>
          <Container maxW="xl" pt={8} pb={16} px={8} color="#F4F6F9">
            <VStack align="stretch" spacing={8}>
              {operations.map(renderDisplay)}
            </VStack>
          </Container>
        </Flex>
      )}
    </StylesProvider>
  )
}
