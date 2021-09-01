import React, { useEffect } from 'react'
import { BiTable, BiTrash, BiPlus } from 'react-icons/bi'
import {
  IconButton,
  Button,
  HStack,
  VStack,
  Text,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputLeftElement,
  useMultiStyleConfig,
  useStyles,
} from '@chakra-ui/react'
import { useForm, useFieldArray } from 'react-hook-form'

import * as checker from '../../../../types/checker'
import { createBuilderField, ConstantFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { DefaultTooltip } from '../../common/DefaultTooltip'
import { ToolbarPortal } from '../ToolbarPortal'
import { useStyledToast } from '../../common/StyledToast'

const InputComponent: ConstantFieldComponent = ({
  constant,
  index,
  toolbar,
}) => {
  const { dispatch, setChanged, isChanged, save } = useCheckerContext()
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('MapTable', {})
  const toast = useStyledToast()

  const { register, control, formState, reset, handleSubmit } = useForm<
    Pick<checker.Constant, 'title' | 'table'>
  >({
    defaultValues: {
      title: constant.title || '',
      ...(constant.table && constant.table.length > 0
        ? { table: constant.table }
        : {}),
    },
  })
  const {
    fields: table,
    append,
    remove,
  } = useFieldArray<Pick<checker.Constant, 'title' | 'table'>>({
    name: 'table',
    control,
  })
  useEffect(() => {
    setChanged(Object.keys(formState.dirtyFields).length > 0)
  }, [formState, setChanged])

  const handleAddTableRow = () => {
    const newTableElem = { key: '', value: NaN }
    append(newTableElem)
  }

  const handleDeleteTableRow = (tableRowIndex: number) => {
    remove(tableRowIndex)
  }

  const handleSave = () => {
    handleSubmit(
      ({ title, table }) => {
        dispatch(
          {
            type: BuilderActionEnum.Update,
            payload: {
              currIndex: index,
              element: { ...constant, title, table },
              configArrName: ConfigArrayEnum.Constants,
            },
          },
          () => {
            reset({ title, table }, { keepValues: true, keepDirty: false })
            toast({
              status: 'success',
              description: 'Constant table updated',
            })
          }
        )
      },
      () => {
        toast({
          status: 'error',
          description: 'Unable to save constant table',
        })
      }
    )()
  }

  return (
    <>
      <VStack
        sx={{ ...commonStyles.fullWidthContainer, ...styles.fieldContainer }}
        spacing={4}
      >
        <InputGroup>
          <InputLeftElement
            sx={commonStyles.inputIconElement}
            children={<BiTable />}
          />
          <Input
            type="text"
            sx={commonStyles.fieldInput}
            placeholder="Table Name"
            {...register('title', {
              required: { value: true, message: 'Title cannot be empty' },
            })}
            isInvalid={!!formState.errors.title}
          />
        </InputGroup>
        <Text fontSize="sm" color="error.500">
          {formState.errors.title?.message}
        </Text>
        <Table sx={styles.table} variant="simple" colorScheme="table">
          <Thead>
            <Tr>
              <Th sx={styles.tableHead}>
                <Text sx={styles.tableHeadText}>Reference</Text>
              </Th>
              <Th sx={styles.tableHead}>
                <Text sx={styles.tableHeadText}>Constant</Text>
              </Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {table.map((_, index) => (
              <Tr key={index}>
                <Td sx={styles.tableCell}>
                  <Input
                    sx={styles.tableInput}
                    type="text"
                    placeholder="Reference"
                    {...register(`table.${index}.key`, {
                      required: {
                        value: true,
                        message: 'Table row value cannot be empty',
                      },
                    })}
                    isInvalid={
                      !!(
                        formState.errors.table &&
                        formState.errors.table[index]?.key
                      )
                    }
                  />
                </Td>
                <Td sx={styles.tableCell}>
                  <Input
                    sx={styles.tableInput}
                    type="number"
                    placeholder="Numeric Value"
                    {...register(`table.${index}.value`, {
                      required: {
                        value: true,
                        message: 'Table row value cannot be empty',
                      },
                    })}
                    isInvalid={
                      !!(
                        formState.errors.table &&
                        formState.errors.table[index]?.value
                      )
                    }
                  />
                </Td>
                <Td sx={styles.deleteCell}>
                  <DefaultTooltip label="Delete row">
                    <IconButton
                      sx={styles.deleteButton}
                      variant="link"
                      colorScheme="error"
                      aria-label="delete item"
                      icon={<BiTrash />}
                      onClick={() => handleDeleteTableRow(index)}
                      isDisabled={table.length <= 1}
                    />
                  </DefaultTooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button
          leftIcon={<BiPlus />}
          sx={styles.addRowButton}
          variant="solid"
          colorScheme="primary"
          aria-label="add map item"
          onClick={handleAddTableRow}
        >
          Add row
        </Button>
      </VStack>
      <ToolbarPortal container={toolbar}>
        <HStack>
          {isChanged && (
            <Button
              isDisabled={save.isLoading}
              colorScheme="primary"
              variant="outline"
              onClick={() => reset(undefined, { keepValues: false })}
            >
              Reset
            </Button>
          )}
          <Button
            colorScheme="primary"
            onClick={handleSave}
            isLoading={save.isLoading}
          >
            Save
          </Button>
        </HStack>
      </ToolbarPortal>
    </>
  )
}

const PreviewComponent: ConstantFieldComponent = ({ constant }) => {
  const { title, table } = constant
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('MapTable', {})

  return (
    <VStack sx={commonStyles.fullWidthContainer} spacing={3}>
      <HStack>
        <BiTable fontSize="20px" />
        <Text sx={commonStyles.previewTitle}>{title}</Text>
      </HStack>
      <HStack>
        <Table sx={styles.table} variant="simple" colorScheme="table">
          <Thead>
            <Tr>
              <Th sx={styles.tableHead}>
                <Text sx={styles.tableHeadText}>Reference</Text>
              </Th>
              <Th sx={styles.tableHead}>
                <Text sx={styles.tableHeadText}>Constant</Text>
              </Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody sx={styles.previewTableBody}>
            {table.map(({ key, value }, index) => (
              <Tr key={index}>
                <Td>{key}</Td>
                {/* Hide NaN value */}
                {isNaN(value) ? <Td /> : <Td>{value}</Td>}
                <Td />
              </Tr>
            ))}
          </Tbody>
        </Table>
      </HStack>
    </VStack>
  )
}

export const MapTable = createBuilderField(InputComponent, PreviewComponent)
