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
      mt: '72px',
      mb: '64px',
      pt: '32px',
      px: '0px',
      w: '100%',
      flexDir: 'column',
    },
  },
}
