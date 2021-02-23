import React from 'react'
import { BiTable, BiTrash, BiPlusCircle } from 'react-icons/bi'
import {
  IconButton,
  Box,
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
} from '@chakra-ui/react'

import * as checker from '../../../../types/checker'
import { createBuilderField, ConstantFieldComponent } from '../BuilderField'
import { useCheckerContext } from '../../../contexts'
import { BuilderActionEnum, ConfigArrayEnum } from '../../../../util/enums'

const InputComponent: ConstantFieldComponent = ({ constant, index }) => {
  const { title, table } = constant
  const { dispatch } = useCheckerContext()

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

  const handleDeleteTableRow = (index: number) => {
    constant.table.splice(index, 1)
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
    <>
      <HStack w="100%" alignItems="flex-start">
        <Box fontSize="20px" pt={2}>
          <BiTable />
        </Box>
        <VStack align="stretch" w="100%">
          <Input
            type="text"
            placeholder="Table Name"
            name="title"
            onChange={handleTitleChange}
            value={title}
          />
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Reference</Th>
                <Th>Constant</Th>
                <Th />
              </Tr>
            </Thead>
          </Table>
          {table.map(({ key, value }, index) => (
            <HStack w="100%" alignItems="flex-start" key={index}>
              <Input
                type="text"
                placeholder="Reference"
                name="Reference"
                onChange={(e) => {
                  handleUpdateTableRow({ key: e.target.value, value }, index)
                }}
                value={key}
              />
              <Input
                type="number"
                placeholder="Constant"
                name="constant"
                onChange={(e) => {
                  handleUpdateTableRow(
                    { key, value: Number(e.target.value) },
                    index
                  )
                }}
                value={value}
              />
              {table.length - 1 === index ? (
                // Last elem in table array
                <IconButton
                  borderRadius={0}
                  variant="ghost"
                  aria-label="add map item"
                  fontSize="20px"
                  icon={<BiPlusCircle />}
                  onClick={handleAddTableRow}
                />
              ) : (
                <IconButton
                  borderRadius={0}
                  variant="ghost"
                  aria-label="add map item"
                  fontSize="20px"
                  icon={<BiTrash />}
                  onClick={() => handleDeleteTableRow(index)}
                />
              )}
            </HStack>
          ))}
        </VStack>
      </HStack>
    </>
  )
}

const PreviewComponent: ConstantFieldComponent = ({ constant }) => {
  const { title, table } = constant
  return (
    <VStack align="stretch" w="100%" spacing={6}>
      <VStack align="stretch">
        <HStack>
          <BiTable fontSize="20px" />
          <Text>{title}</Text>
        </HStack>
        <HStack>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Reference</Th>
                <Th>Constant</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
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
    </VStack>
  )
}

export const MapTable = createBuilderField(InputComponent, PreviewComponent)
