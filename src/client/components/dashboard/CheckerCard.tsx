import React, { FC } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { useHistory, useRouteMatch, Link, Route } from 'react-router-dom'
import { BiDuplicate, BiTrash } from 'react-icons/bi'
import {
  useDisclosure,
  useMultiStyleConfig,
  useToast,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react'

import { Checker } from '../../../types/checker'
import { getApiErrorMessage } from '../../api'
import { CheckerService } from '../../services'
import { CreateNewModal } from './CreateNewModal'
import { ConfirmDialog } from '../ConfirmDialog'

type CheckerCardProps = {
  checker: Checker
}

export const CheckerCard: FC<CheckerCardProps> = ({ checker }) => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast({ position: 'bottom-right', variant: 'solid' })
  const styles = useMultiStyleConfig('CheckerCard', {})

  const queryClient = useQueryClient()
  const deleteChecker = useMutation(CheckerService.deleteChecker, {
    onSuccess: () => {
      queryClient.invalidateQueries('checkers')
      toast({
        status: 'success',
        title: 'Checker deleted',
        description: `${checker.id} has been successfully deleted`,
      })
    },
    onError: (err) => {
      toast({
        status: 'error',
        title: 'An error has occurred',
        description: getApiErrorMessage(err),
      })
    },
  })

  const onClickDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    onOpen()
  }

  const onDeleteConfirm = () => deleteChecker.mutateAsync(checker.id)

  const onDuplicateClick = (e: React.MouseEvent) => {
    e.preventDefault()
    history.push(`${path}/${checker.id}/duplicate`)
  }

  return (
    <>
      <Link to={{ pathname: `/builder/${checker.id}` }}>
        <VStack sx={styles.card} align="stretch" role="group">
          <Text flex={1} sx={styles.title} isTruncated>
            {checker.title}
          </Text>
          <HStack sx={styles.actions}>
            <BiDuplicate onClick={onDuplicateClick} size="24px" />
            <BiTrash onClick={onClickDelete} size="24px" />
          </HStack>
        </VStack>
      </Link>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onDeleteConfirm}
        title="Delete checker"
        description="Are you sure? You cannot undo this action afterwards."
      />
      <Route
        path={`${path}/${checker.id}/duplicate`}
        render={() => (
          <CreateNewModal
            isOpen
            onClose={() => history.push(path)}
            checker={checker}
          />
        )}
      />
    </>
  )
}
