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

import { CheckboxField, RadioField, NumericField, DateField } from './fields'
import { LineDisplay } from './displays'
import * as checker from './../../types/checker'
import { evaluate } from './../core/evaluator'

interface CheckerProps {
  config: checker.Checker
}

type VariableResults = Record<string, string | number>

export const Checker: FC<CheckerProps> = ({ config }) => {
  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const styles = useMultiStyleConfig('Checker', {})
  const methods = useForm()
  const { title, description, fields, operations, constants } = config
  const [variables, setVariables] = useState<VariableResults>({})
  const outcomes = useRef<HTMLDivElement | null>(null)

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

  const renderDisplay = (operation: checker.Operation, i: number) => {
    return (
      operation.show && (
        <LineDisplay
          key={i}
          label={operation.title}
          value={variables[operation.id] as string}
        />
      )
    )
  }

  const onSubmit = (inputs: Record<string, string | number>) => {
    // Set all numeric inputs to type Number
    const parsedInputs: Record<string, string | number> = {}

    fields.forEach((field) => {
      const { id, type, options } = field
      if (!inputs[id]) return

      switch (type) {
        case 'NUMERIC': {
          return (parsedInputs[id] = Number(inputs[id]))
        }
        case 'RADIO': {
          return (parsedInputs[id] = options[Number(inputs[id])].label)
        }
        case 'CHECKBOX': {
          const checkboxValues = Object.values(inputs[id]).map(
            (optionIndex) => options[optionIndex].label
          )
          return (parsedInputs[id] = JSON.stringify(checkboxValues))
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
      outcomes.current?.scrollIntoView()
    } catch (err) {
      toast({
        status: 'error',
        title: err.name,
        description: err.message,
      })
    }
  }

  // Ensure that at least one operation with `show: true`
  const isCheckerComplete = () => filter(operations, 'show').length > 0

  return (
    <StylesProvider value={styles}>
      <Container maxW="xl" p={8} mb={4}>
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
            <VStack align="strech" spacing={8}>
              {operations.map(renderDisplay)}
            </VStack>
          </Container>
        </Flex>
      )}
    </StylesProvider>
  )
}
