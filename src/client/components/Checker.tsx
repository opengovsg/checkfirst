import React, { FC, useState, useRef } from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { VscDebugRestart } from 'react-icons/vsc'
import { isEmpty, filter } from 'lodash'
import {
  useMultiStyleConfig,
  StylesProvider,
  VStack,
  Stack,
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
import { useStyledToast } from './common/StyledToast'

// polyfill for browsers that don't support smooth scroling
if (!('scrollBehavior' in document.documentElement.style)) {
  import('scroll-behavior-polyfill')
}

interface CheckerProps {
  config: checker.Checker
}

function isUnit(
  output: string | number | Unit | Record<string, number>
): output is Unit {
  return (output as Unit).toNumber !== undefined
}

export const Checker: FC<CheckerProps> = ({ config }) => {
  const styledToast = useStyledToast()
  const styles = useMultiStyleConfig('Checker', {})
  const methods = useForm()
  const { title, description, fields, operations, constants } = config
  const [variables, setVariables] = useState<checker.VariableResults>({})
  const googleAnalytics = useGoogleAnalytics()
  const outcomes = useRef<HTMLDivElement | null>(null)
  const header = useRef<HTMLDivElement | null>(null)

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
      if (inputs[id] === null || inputs[id] === undefined) return

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
      styledToast({
        status: 'warning',
        description:
          'Results cannot be shown because checker logic is not available.',
      })
    }

    try {
      const computed = evaluate(parsedInputs, constants, operations)
      setVariables(computed)
      // Required to wrap this in requestAnimationFrame frame due to bug in React.
      // See https://github.com/facebook/react/issues/20770
      requestAnimationFrame(() => {
        outcomes.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      })
    } catch (err) {
      styledToast({
        status: 'error',
        description: `${err.name}: ${err.message}`,
      })
    }

    googleAnalytics.sendUserEvent(googleAnalytics.GA_USER_EVENTS.SUBMIT)
  }

  // Ensure that at least one operation with `show: true`
  const isCheckerComplete = () => filter(operations, 'show').length > 0

  const reset = (keepValues = false) => {
    // Reset values only if keepValues is false
    if (!keepValues) {
      fields.forEach((field) => {
        switch (field.type) {
          case 'NUMERIC':
            methods.setValue(field.id, 0)
            break
          case 'DATE':
            methods.setValue(field.id, new Date())
            break
          case 'RADIO':
            methods.setValue(field.id, '')
            break
          case 'CHECKBOX':
            methods.setValue(field.id, [])
            break
          case 'DROPDOWN':
            methods.setValue(field.id, '')
            break
        }
      })
    }

    methods.reset({}, { keepValues: true })
    setVariables({})

    requestAnimationFrame(() => {
      header.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    })
  }

  return (
    <StylesProvider value={styles}>
      <Flex
        w={{ base: '100%', lg: '832px' }}
        p="40px"
        bg="white"
        sx={{ overscrollBehavior: 'contain' }}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <VStack align="stretch" spacing={10}>
              <VStack spacing={2}>
                <Text ref={header} sx={styles.title}>
                  {title}
                </Text>
                {description && <Text sx={styles.subtitle}>{description}</Text>}
              </VStack>
              {fields.map(renderField)}
              <Button
                colorScheme="primary"
                width="100%"
                type="submit"
                isDisabled={methods.formState.isSubmitSuccessful}
              >
                Show results
              </Button>
            </VStack>
          </form>
        </FormProvider>
      </Flex>

      {!isEmpty(variables) && isCheckerComplete() && (
        <Flex
          w={{ base: '100%', md: '832px' }}
          bg="primary.500"
          as="div"
          ref={outcomes}
          flex={1}
          color="neutral.200"
          pt={8}
          pb={16}
          px={8}
        >
          <VStack align="stretch" spacing="40px">
            {operations.map(renderDisplay)}
            <Stack
              direction={{ base: 'column', md: 'row' }}
              alignItems="center"
              justifyContent="center"
              spacing="16px"
            >
              <Button
                w={{ base: '100%', md: 'auto' }}
                _hover={{ bg: 'primary.300' }}
                rightIcon={<BiEditAlt />}
                variant="outline"
                onClick={() => reset(true)}
              >
                Edit fields
              </Button>
              <Button
                w={{ base: '100%', md: 'auto' }}
                _hover={{ bg: 'primary.300' }}
                rightIcon={<VscDebugRestart />}
                variant="outline"
                onClick={() => reset()}
              >
                Restart checker
              </Button>
            </Stack>
          </VStack>
        </Flex>
      )}
    </StylesProvider>
  )
}
