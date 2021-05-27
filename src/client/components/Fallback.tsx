import React, { FC } from 'react'
import { Box, Button, Center, Image, VStack, Text } from '@chakra-ui/react'

// Images
import notFoundErrorImage from '../assets/states/error-404.svg'
import Logo from '../assets/checkfirst-logo.svg'

interface FallbackProps {
  resetError: () => void
}

export const Fallback: FC<FallbackProps> = ({ resetError }) => (
  <Center py={16}>
    <VStack spacing={4}>
      <Image
        flex={1}
        src={notFoundErrorImage}
        height={{ base: '257px', lg: 'auto' }}
        mb={{ base: '24px', lg: '0px' }}
      />
      <Text textStyle="heading2" color="primary.500">
        Something went wrong.
      </Text>
      <Button
        colorScheme="primary"
        onClick={() => {
          resetError()
        }}
      >
        Back to CheckFirst
      </Button>
      <Box pt={32}>
        <Image htmlWidth="144px" src={Logo} />
      </Box>
    </VStack>
  </Center>
)
