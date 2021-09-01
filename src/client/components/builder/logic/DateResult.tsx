import React, { useEffect } from 'react'
import { isValidExpression } from '../../../../shared/core/evaluator'
import { BiCalendar, BiChevronDown } from 'react-icons/bi'
import {
  VStack,
  HStack,
  Text,
  Input,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputLeftElement,
  useStyles,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { useStyledToast } from '../../common/StyledToast'
import { FormulaPreview } from './FormulaPreview'
import { ToolbarPortal } from '../ToolbarPortal'

interface DateState {
  variableId: string
  isAdd: boolean
  numberOfIntervals: string | number
}

const EMPTY_STATE: DateState = {
  variableId: '',
  isAdd: true,
  numberOfIntervals: 0,
}

// TODO: Make more rigorous to include other time units
const fromExpression = (expression: string): DateState => {
  const splitExpression = expression.split(' ')
  // eg. splitExpression = [ 'D1', '+', '14', 'days' ]

  if (splitExpression.length === 4) {
    return {
      variableId: splitExpression[0],
      isAdd: splitExpression[1] === '+',
      numberOfIntervals: Number(splitExpression[2]),
    }
  }

  return EMPTY_STATE
}

const toExpression = (state: DateState): string => {
  const { variableId, isAdd, numberOfIntervals } = state
  return `${variableId} ${isAdd ? '+' : '-'} ${numberOfIntervals} days`
}

const InputComponent: OperationFieldComponent = ({
  operation,
  index,
  toolbar,
}) => {
  const { title, expression, id: currentId } = operation
  const { config, setChanged, isChanged, dispatch, save } = useCheckerContext()
  const initialDate = fromExpression(expression)
  const toast = useStyledToast()
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('DateResult', {})

  const { register, formState, control, handleSubmit, reset } = useForm<
    { title: string } & DateState
  >({
    defaultValues: {
      title,
      ...initialDate,
    },
  })
  useEffect(() => {
    setChanged(formState.isDirty)
  }, [formState.isDirty, setChanged])

  const renderBadgeWithTitle = (
    id: string,
    title: string,
    badgeCol: string
  ) => (
    <HStack sx={styles.menuRowContainer} spacing={4}>
      <Badge sx={styles.menuRowBadge} bg={badgeCol}>
        {id}
      </Badge>
      <Text isTruncated>{title}</Text>
    </HStack>
  )

  const handleSave = () => {
    handleSubmit(
      (data) => {
        const { title, ...dateState } = data
        const expression = toExpression(dateState)
        if (isValidExpression(expression)) {
          dispatch(
            {
              type: BuilderActionEnum.Update,
              payload: {
                currIndex: index,
                element: { ...operation, title, expression },
                configArrName: ConfigArrayEnum.Operations,
              },
            },
            () => {
              reset(data, { keepValues: true, keepDirty: false })
              toast({
                status: 'success',
                description: 'Logic block updated',
              })
            }
          )
        } else {
          toast({
            status: 'error',
            description: 'Unable to save logic block',
          })
        }
      },
      () => {
        toast({
          status: 'error',
          description: 'Unable to save logic block',
        })
      }
    )()
  }

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={4}>
      <InputGroup>
        <InputLeftElement
          sx={commonStyles.inputIconElement}
          children={<BiCalendar />}
        />
        <Input
          sx={commonStyles.fieldInput}
          type="text"
          placeholder="Operation title"
          {...register('title', {
            required: { value: true, message: 'Title cannot be empty' },
          })}
          isInvalid={!!formState.errors.title}
        />
      </InputGroup>
      <Text fontSize="sm" color="error.500">
        {formState.errors.title?.message}
      </Text>
      <HStack sx={styles.dateContainer} spacing={4}>
        <Controller
          name="variableId"
          rules={{
            required: { value: true, message: 'Variable cannot be empty' },
          }}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Menu matchWidth>
                {({ onClose }) => (
                  <>
                    <MenuButton
                      as={Button}
                      sx={styles.questionButton}
                      variant="outline"
                      rightIcon={<BiChevronDown />}
                    >
                      <Text
                        sx={styles.menuButtonText}
                        textColor={value ? 'secondary.700' : 'neutral.500'}
                      >
                        {value || 'Select question'}
                      </Text>
                    </MenuButton>
                    <MenuList>
                      {config.fields
                        .filter(({ type }) => type === 'DATE')
                        .map(({ id, title }, i) => (
                          <MenuItem
                            key={i}
                            onClick={() => {
                              onChange(id)
                              onClose()
                            }}
                          >
                            {renderBadgeWithTitle(id, title, 'success.500')}
                          </MenuItem>
                        ))}
                      {config.operations
                        .filter(
                          ({ id, type }) => type === 'DATE' && id !== currentId
                        )
                        .map(({ id, title }, i) => (
                          <MenuItem
                            key={i}
                            onClick={() => {
                              onChange(id)
                              onClose()
                            }}
                          >
                            {renderBadgeWithTitle(id, title, 'primary.500')}
                          </MenuItem>
                        ))}
                    </MenuList>
                  </>
                )}
              </Menu>
            )
          }}
        />
        <Controller
          name="isAdd"
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Menu matchWidth>
                <MenuButton
                  as={Button}
                  sx={styles.operatorButton}
                  variant="outline"
                  rightIcon={<BiChevronDown />}
                >
                  <Text sx={styles.menuButtonText}>{value ? '+' : '-'}</Text>
                </MenuButton>
                <MenuList sx={styles.operatorMenuList}>
                  <MenuItem onClick={() => onChange(true)}>+</MenuItem>
                  <MenuItem onClick={() => onChange(false)}>-</MenuItem>
                </MenuList>
              </Menu>
            )
          }}
        />
        <Controller
          name="numberOfIntervals"
          rules={{
            required: {
              value: true,
              message: 'Number of intervals cannot be empty',
            },
            min: {
              value: 0,
              message: 'Number of intervals cannot be less than 0',
            },
          }}
          control={control}
          render={({
            field: { name, value, onChange, ref },
            fieldState: { invalid },
          }) => {
            return (
              <NumberInput
                name={name}
                sx={styles.numberInput}
                precision={0}
                step={1}
                min={0}
                value={value}
                onChange={onChange}
                isInvalid={invalid}
              >
                <NumberInputField
                  sx={styles.numberField}
                  placeholder="Number"
                  ref={ref}
                />
              </NumberInput>
            )
          }}
        />
        <Text sx={styles.daysText}>DAYS</Text>
      </HStack>
      <Text fontSize="sm" color="error.500">
        {(formState.errors.variableId || formState.errors.numberOfIntervals) &&
          'Invalid date logic. Please check inputs.'}
      </Text>
      <ToolbarPortal container={toolbar}>
        <HStack>
          {isChanged && (
            <Button
              colorScheme="primary"
              variant="outline"
              onClick={() => reset(undefined, { keepValues: false })}
            >
              Reset
            </Button>
          )}
          <Button
            isLoading={save.isLoading}
            colorScheme="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </HStack>
      </ToolbarPortal>
    </VStack>
  )
}

const PreviewComponent: OperationFieldComponent = ({ operation }) => {
  const { show, title, expression } = operation
  return (
    <FormulaPreview
      show={show}
      title={title}
      expression={expression}
      icon={BiCalendar}
    />
  )
}

export const DateResult = createBuilderField(InputComponent, PreviewComponent)
