import React, { useEffect } from 'react'
import { isValidExpression, math } from '../../../../shared/core/evaluator'
import { BiGitCompare, BiChevronDown } from 'react-icons/bi'
import {
  Badge,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  useStyles,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'

import { useCheckerContext } from '../../../contexts'
import { createBuilderField, OperationFieldComponent } from '../BuilderField'
import { useStyledToast } from '../../common/StyledToast'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { ToolbarPortal } from '../ToolbarPortal'
import { FormulaPreview } from './FormulaPreview'

interface MapState {
  tableId: string
  variableId: string
}

const EMPTY_STATE: MapState = {
  tableId: '',
  variableId: '',
}

const fromExpression = (expression: string) => {
  const root = math.parse!(expression)
  const args: string[] = []
  root.forEach((node) => args.push(node.toString()))

  if (root.isAccessorNode && args.length === 2) {
    return {
      tableId: args[0],
      variableId: args[1].slice(1, -1),
    }
  }

  return EMPTY_STATE
}

const toExpression = (state: MapState): string => {
  const { variableId, tableId } = state

  // Set a valid expression if the mapState isn't properly defined
  if (!variableId || !tableId) {
    return '0'
  } else {
    return `${tableId}[${variableId}]`
  }
}

const InputComponent: OperationFieldComponent = ({
  operation,
  index,
  toolbar,
}) => {
  const { config, setChanged, dispatch, save } = useCheckerContext()

  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('MapResult', {})
  const toast = useStyledToast()

  const initialMapState = fromExpression(operation.expression)
  const { handleSubmit, register, formState, control, reset } = useForm<
    { title: string } & MapState
  >({
    defaultValues: {
      title: operation.title,
      tableId: initialMapState.tableId || '',
      variableId: initialMapState.variableId || '',
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
        const { title, ...mapState } = data
        const expression = toExpression(mapState)
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
          children={<BiGitCompare />}
        />
        <Input
          sx={commonStyles.fieldInput}
          type="text"
          placeholder="Result description"
          {...register('title', {
            required: { value: true, message: 'Title cannot be empty' },
          })}
          isInvalid={!!formState.errors.title}
        />
      </InputGroup>
      <Text fontSize="sm" color="error.500">
        {formState.errors.title?.message}
      </Text>
      <HStack sx={styles.mapContainer} spacing={4}>
        <Text sx={styles.mapText}>MAP</Text>
        <Controller
          name="variableId"
          rules={{
            required: { value: true, message: 'Table ID cannot be empty' },
          }}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Menu matchWidth preventOverflow={false}>
                {({ onClose }) => (
                  <>
                    <MenuButton
                      as={Button}
                      sx={styles.menuButton}
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
                    <MenuList sx={styles.menuList}>
                      {config.fields.map(({ id, title }, i) => (
                        <MenuItem
                          key={i}
                          onClick={() => {
                            onChange(id)
                            onClose()
                          }}
                        >
                          {renderBadgeWithTitle(id, title, 'error.500')}
                        </MenuItem>
                      ))}
                      {config.operations.map(({ id, title }, i) => (
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
                    </MenuList>
                  </>
                )}
              </Menu>
            )
          }}
        />
        <Text sx={styles.toText}>TO</Text>
        <Controller
          name="tableId"
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Menu matchWidth>
                {({ onClose }) => (
                  <>
                    <MenuButton
                      as={Button}
                      sx={styles.menuButton}
                      variant="outline"
                      rightIcon={<BiChevronDown />}
                    >
                      <Text
                        sx={styles.menuButtonText}
                        textColor={value ? 'secondary.700' : 'neutral.500'}
                      >
                        {value || 'Select constant table'}
                      </Text>
                    </MenuButton>
                    <MenuList sx={styles.menuList}>
                      {config.constants.map(({ id, title }, i) => (
                        <MenuItem
                          key={i}
                          onClick={() => {
                            onChange(id)
                            onClose()
                          }}
                        >
                          {renderBadgeWithTitle(id, title, 'warning.500')}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </>
                )}
              </Menu>
            )
          }}
        />
      </HStack>
      <Text fontSize="sm" color="error.500">
        {(formState.errors.variableId || formState.errors.tableId) &&
          'Invalid mapping logic. Please check inputs.'}
      </Text>
      <ToolbarPortal container={toolbar}>
        <Button
          isLoading={save.isLoading}
          colorScheme="primary"
          onClick={handleSave}
        >
          Save
        </Button>
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
      icon={BiGitCompare}
    />
  )
}

export const MapResult = createBuilderField(InputComponent, PreviewComponent)
