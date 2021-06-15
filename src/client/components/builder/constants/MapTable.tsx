import React from 'react'
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

import * as checker from '../../../../types/checker'
import { createBuilderField, ConstantFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'
import { DefaultTooltip } from '../../common/DefaultTooltip'

const InputComponent: ConstantFieldComponent = ({ constant, index }) => {
  const { title, table } = constant
  const { dispatch } = useCheckerContext()
  const commonStyles = useStyles()
  const styles = useMultiStyleConfig('MapTable', {})

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...constant, [name]: value },
        configArrName: ConfigArrayEnum.Constants,
      },
    })
  }

  const handleAddTableRow = () => {
    const newTableElem = { key: '', value: NaN }
    constant.table.push(newTableElem)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...constant, table: constant.table },
        configArrName: ConfigArrayEnum.Constants,
      },
    })
  }

  const handleDeleteTableRow = (tableRowIndex: number) => {
    constant.table.splice(tableRowIndex, 1)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...constant, table: constant.table },
        configArrName: ConfigArrayEnum.Constants,
      },
    })
  }

  const handleUpdateTableRow = (
    updatedTableElem: checker.TableElem,
    tableRowIndex: number
  ) => {
    constant.table.splice(tableRowIndex, 1, updatedTableElem)
    dispatch({
      type: BuilderActionEnum.Update,
      payload: {
        currIndex: index,
        element: { ...constant, table: constant.table },
        configArrName: ConfigArrayEnum.Constants,
      },
    })
  }

  return (
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
          name="title"
          onChange={handleTitleChange}
          value={title}
        />
      </InputGroup>
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
          {table.map(({ key, value }, index) => (
            <Tr key={index}>
              <Td sx={styles.tableCell}>
                <Input
                  sx={styles.tableInput}
                  type="text"
                  placeholder="Reference"
                  name="Reference"
                  onChange={(e) => {
                    handleUpdateTableRow({ key: e.target.value, value }, index)
                  }}
                  value={key}
                />
              </Td>
              <Td sx={styles.tableCell}>
                <Input
                  sx={styles.tableInput}
                  type="number"
                  placeholder="Numeric Value"
                  name="constant"
                  onChange={(e) => {
                    handleUpdateTableRow(
                      { key, value: Number(e.target.value) },
                      index
                    )
                  }}
                  value={value}
                />
              </Td>
              <Td sx={styles.deleteCell}>
                <DefaultTooltip label="Delete mapping">
                  <IconButton
                    sx={styles.deleteButton}
                    variant="link"
                    colorScheme="error"
                    aria-label="delete item"
                    icon={<BiTrash />}
                    onClick={() => handleDeleteTableRow(index)}
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
