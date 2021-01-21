import React, { useState, FC } from 'react'
import { BiDuplicate, BiTrash } from 'react-icons/bi'
import { useMultiStyleConfig, Box, Text, HStack } from '@chakra-ui/react'

import { Checker } from '../../../types/checker'
import { ApiClient } from '../../api'

type CheckerCardProps = {
  onDelete: () => void
  checker: Checker
}

export const CheckerCard: FC<CheckerCardProps> = ({ onDelete, checker }) => {
  const styles = useMultiStyleConfig('CheckerCard', {})
  const [isToolbarVisible, setToolbarVisible] = useState<'visible' | 'hidden'>(
    'hidden'
  )

  const onClickDelete = async () => {
    try {
      await ApiClient.delete(`/c/${checker.id}`)
      onDelete()
    } catch (error) {
      // TODO: Pop this into a toaster
      // eslint-disable-next-line no-console
      console.error(error.response.data.message)
    }
  }

  return (
    <Box
      onMouseOver={() => setToolbarVisible('visible')}
      onMouseOut={() => setToolbarVisible('hidden')}
      sx={styles.card}
    >
      <Text sx={styles.title}>{checker.title}</Text>
      <HStack
        visibility={isToolbarVisible}
        mt="50px"
        mb="35px"
        justifyContent="center"
      >
        <BiDuplicate size="24px" />
        <BiTrash onClick={onClickDelete} size="24px" />
      </HStack>
    </Box>
  )
}
