import React, { FC } from 'react'
import { BiShow, BiPlus } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Divider,
  Text,
  Center,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  VStack,
  HStack,
  Spinner,
} from '@chakra-ui/react'

import { TemplateService } from '../../services'

interface TemplateInfoProps {
  id: number
  title: string
  description: string
}
const TemplateInfo: FC<TemplateInfoProps> = ({ id, title, description }) => (
  <Link to={`/dashboard/create/template/${id}/preview`}>
    <HStack justifyContent="center" p="24px" _hover={{ bgColor: '#F4F6F9' }}>
      <VStack spacing={0} align="stretch" width="90%">
        <Text color="#1B3C87" textStyle="sub1">
          {title}
        </Text>
        <Text textStyle="sub2" color="#6D7580" maxW="100%" noOfLines={2}>
          {description}
        </Text>
      </VStack>
      <Center flex={1} justifyContent="center" fontSize="20px" color="#1B3C87">
        <BiShow />
      </Center>
    </HStack>
  </Link>
)

export const SelectTemplate: FC = () => {
  const { isLoading, data: templates } = useQuery('templates', () =>
    TemplateService.listTemplates()
  )

  return (
    <>
      <ModalHeader>Create new checker</ModalHeader>
      <ModalBody>
        <VStack>
          <Center pt="16px" pb="32px">
            <HStack spacing="32px">
              <Link to="/dashboard/create/new">
                <Button leftIcon={<BiPlus />} colorScheme="primary">
                  Create from scratch
                </Button>
              </Link>
              <Text textStyle="body2" color="#6D7580">
                or choose from template below
              </Text>
            </HStack>
          </Center>
        </VStack>

        <Divider />
        {isLoading ? (
          <Center py={16}>
            <Spinner size="lg" color="primary.500" thickness="4px" />
          </Center>
        ) : (
          <VStack align="stretch" spacing={0} divider={<Divider />}>
            {templates && templates.length < 1 && (
              <Center py="32px" textStyle="body2">
                No templates found
              </Center>
            )}
            {templates?.map(({ id, title, description }) => (
              <TemplateInfo
                key={id}
                id={id}
                title={title}
                description={description}
              />
            ))}
          </VStack>
        )}
      </ModalBody>
      <ModalFooter />
    </>
  )
}
