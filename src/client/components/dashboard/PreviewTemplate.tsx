import React, { FC } from 'react'
import { BiX } from 'react-icons/bi'
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Flex,
  IconButton,
  Button,
  HStack,
  Text,
  Link,
  useMultiStyleConfig,
} from '@chakra-ui/react'

import * as checker from '../../../types/checker'
import { TemplateService } from '../../services'
import { Checker } from '..'
import { NavbarContainer } from '../common/navbar/NavbarContainer'
import { NavbarBack } from '../common/navbar/NavbarBack'

export const PreviewTemplate: FC = () => {
  const { templateId } = useParams<{ templateId: string }>()
  const { isLoading, data: template } = useQuery(['template', templateId], () =>
    TemplateService.getTemplate(templateId)
  )
  const config = { ...template, id: 'preview' } as checker.Checker
  const history = useHistory()
  const navStyles = useMultiStyleConfig('NavbarComponents', {})
  const styles = useMultiStyleConfig('PreviewTemplate', {})

  return (
    <Flex sx={styles.container}>
      <NavbarContainer
        leftElement={
          <NavbarBack
            label={'Back to templates'}
            handleClick={() => history.push('/dashboard/create')}
          />
        }
        centerElement={<Text sx={styles.title}>{config.title}</Text>}
        rightElement={
          <HStack spacing={5}>
            <Link
              as={RouterLink}
              to={`/dashboard/create/template/${templateId}`}
            >
              <Button colorScheme="primary" sx={navStyles.button}>
                Use template
              </Button>
            </Link>
            <Link as={RouterLink} to="/dashboard" sx={styles.closeLink}>
              <IconButton
                variant="link"
                sx={styles.closeButton}
                aria-label="Close"
                icon={<BiX />}
              />
            </Link>
          </HStack>
        }
      />
      <Flex sx={styles.checkerContainer} direction="column" alignItems="center">
        {!isLoading ? <Checker config={config} /> : null}
      </Flex>
    </Flex>
  )
}
