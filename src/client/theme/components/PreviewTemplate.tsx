import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const PreviewTemplate: ComponentMultiStyleConfig = {
  parts: ['container', 'title', 'closeLink', 'closeButton'],
  baseStyle: {
    container: {
      minH: '100vh',
      direction: 'column',
    },
    title: {
      textAlign: 'center',
      textStyle: 'subhead1',
      color: 'primary.500',
    },
    closeLink: {
      h: 6,
    },
    closeButton: {
      color: 'neutral.400',
      fontSize: '24px',
      minW: 6,
    },
    checkerContainer: {
      mt: '144px',
      mb: '64px',
      maxW: 'xl',
      pt: '32px',
      px: '0px',
      bg: 'white',
      borderRadius: '12px',
    },
  },
}
