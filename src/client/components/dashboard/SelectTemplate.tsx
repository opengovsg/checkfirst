import React, { FC } from 'react'
import { BiShow, BiPlus } from 'react-icons/bi'
import { Link } from 'react-router-dom'
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
} from '@chakra-ui/react'

interface TemplateInfoProps {
  id: string
  name: string
  description: string
}
const TemplateInfo: FC<TemplateInfoProps> = ({ id, name, description }) => (
  <Link to={`/dashboard/create/template/${id}/preview`}>
    <HStack justifyContent="center" p="24px" _hover={{ bgColor: '#F4F6F9' }}>
      <VStack spacing={0} flex={1} align="stretch">
        <Text color="#1B3C87" textStyle="sub1">
          {name}
        </Text>
        <Text textStyle="sub2" color="#6D7580">
          {description}
        </Text>
      </VStack>
      <Text fontSize="20px" color="#1B3C87">
        <BiShow />
      </Text>
    </HStack>
  </Link>
)

export const SelectTemplate: FC = () => {
  // TODO: fetch templates
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
        <VStack align="stretch" spacing={0} divider={<Divider />}>
          <TemplateInfo
            id="1"
            name="Template 1"
            description="This is template 1"
          />
          <TemplateInfo
            id="2"
            name="Template 2"
            description="This is template 2"
          />
          <TemplateInfo
            id="3"
            name="Template 3"
            description="This is template 3"
          />
        </VStack>
      </ModalBody>
      <ModalFooter />
    </>
  )
}
