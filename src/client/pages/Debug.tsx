import React, { FC, useState } from 'react'
import { Flex, Button, Box, Center, Text, useToast } from '@chakra-ui/react'
import { Checker } from '../components'

import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'

const TOAST_POSITION = 'bottom-right'

export const Debug: FC = () => {
  const [json, setJson] = useState('')
  const [checkerConfig, setCheckerConfig] = useState<any>(null)
  const toast = useToast()

  const renderChecker = () => {
    try {
      const checker = JSON.parse(json)
      setCheckerConfig(checker)
      toast({
        title: 'Checker rendered',
        status: 'success',
        position: TOAST_POSITION,
      })
    } catch (err) {
      toast({
        title: 'Unable to parse JSON',
        description: err.message,
        status: 'error',
        position: TOAST_POSITION,
      })
    }
  }

  return (
    <Flex direction="row" h="100vh" bgColor="neutral.50">
      <Box w="40%" minW="640px" h="full">
        <AceEditor
          placeholder="Enter checker config object"
          width="100%"
          height="100%"
          mode="json"
          theme="monokai"
          onChange={(json) => setJson(json.trim())}
        />
      </Box>

      <Flex direction="column" flex={1} h="full" overflowY="auto" p={8}>
        <Box w="100%" textAlign="right" mb={8}>
          <Button colorScheme="primary" onClick={renderChecker}>
            Render
          </Button>
        </Box>
        {checkerConfig ? (
          <Checker config={checkerConfig} />
        ) : (
          <Center color="neutral.500" flex={1}>
            <Text fontWeight="bold">No check config found!</Text>
          </Center>
        )}
      </Flex>
    </Flex>
  )
}
