import React, { FC } from 'react'
import { BiArrowBack, BiX } from 'react-icons/bi'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Flex, IconButton, Button, HStack, Container } from '@chakra-ui/react'

import * as checker from '../../../types/checker'
import { TemplateService } from '../../services'
import { Checker } from '..'

export const PreviewTemplate: FC = () => {
  const { templateId } = useParams<{ templateId: string }>()
  const { isLoading, data: template } = useQuery(['template', templateId], () =>
    TemplateService.getTemplate(templateId)
  )
  const config = { ...template, id: 'preview' } as checker.Checker

  return (
    <Flex minH="100vh" direction="column">
      <Flex
        h="80px"
        direction="row"
        bgColor="white"
        px={10}
        alignItems="center"
        position="fixed"
        w="100%"
        zIndex={999}
      >
        <HStack w="100%" justifyContent="space-between">
          <HStack>
            <Link to="/dashboard/create">
              <Button
                aria-label="Back"
                variant="ghost"
                leftIcon={<BiArrowBack />}
                textStyle="body1"
              >
                Back to templates
              </Button>
            </Link>
          </HStack>
          <HStack spacing="16px">
            <Link to={`/dashboard/create/template/${templateId}`}>
              <Button colorScheme="primary">Use template</Button>
            </Link>
            <Link to="/dashboard">
              <IconButton
                color="#A5ABB3"
                fontSize="20px"
                aria-label="Close"
                variant="ghost"
                icon={<BiX />}
              />
            </Link>
          </HStack>
        </HStack>
      </Flex>
      <Container
        mt="144px"
        mb="64px"
        maxW="xl"
        pt="32px"
        px="0px"
        bg="white"
        borderRadius="12px"
      >
        {!isLoading ? <Checker config={config} /> : null}
      </Container>
    </Flex>
  )
}
