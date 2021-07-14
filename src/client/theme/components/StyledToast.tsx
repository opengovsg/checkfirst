import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const StyledToast: ComponentMultiStyleConfig = {
  parts: [
    'boxContainer',
    'toastBox',
    'container',
    'icon',
    'message',
    'closeButton',
  ],
  baseStyle: ({ colorScheme }) => ({
    boxContainer: {
      w: '100vw',
      position: 'absolute',
      left: 0,
      right: 0,
      px: 2,
      justifyContent: 'center',
      pointerEvents: 'none',
    },
    toastBox: {
      w: { base: '100%', md: '680px' },
      minH: '56px',
      p: 4,
      bg: `${colorScheme}.100`,
      borderWidth: '1px',
      borderColor: `${colorScheme}.500`,
      borderRadius: '3px',
      pointerEvents: 'auto',
    },
    container: {
      alignItems: 'start',
    },
    icon: {
      boxSize: '24px',
      color: `${colorScheme}.500`,
    },
    message: {
      textStyle: 'body1',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: { md: 'nowrap' },
      maxHeight: 12,
    },
    closeButton: {
      minW: '24px',
      fontSize: '24px',
      ml: 2,
      color: 'secondary.700',
    },
  }),
  defaultProps: {
    colorScheme: 'success',
  },
}
