import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const ConditionalResult: ComponentMultiStyleConfig = {
  parts: [
    'inputLabel',
    'spacedInputLabel',
    'inputContainer',
    'menuButton',
    'menuList',
    'menuItem',
    'deleteSpacer',
    'deleteButton',
    'addButton',
    'divider',
  ],
  baseStyle: {
    inputLabel: {
      w: '48px',
      mr: 2,
      textStyle: 'subhead3',
      lineHeight: '40px',
    },
    spacedInputLabel: {
      w: '96px',
      mr: 2,
      textStyle: 'subhead3',
      lineHeight: '40px',
    },
    inputContainer: {
      alignItems: 'start',
    },
    menuButton: {
      w: '96px',
      mr: 2,
      textStyle: 'subhead3',
      fontSize: '14px',
      borderRadius: '3px',
    },
    menuList: {
      borderRadius: '3px',
      minW: '160px',
      py: 3,
    },
    menuItem: {
      borderRadius: 0,
      px: 5,
      py: 3,
      textStyle: 'body1',
      textAlign: 'start',
      justifyContent: 'initial',
      height: '48px',
    },
    deleteSpacer: {
      w: '40px',
    },
    deleteButton: {
      color: 'error.500',
      borderRadius: '3px',
      fontSize: '20px',
    },
    addButton: {
      textStyle: 'subhead1',
      fontWeight: '500',
      w: 'fit-content',
      h: '44px',
      borderRadius: '3px',
    },
    divider: {
      // !important is required to break out of chakra's stack selectors
      // refer to https://github.com/chakra-ui/chakra-ui/issues/2476
      ml: '-24px !important',
      mr: '-32px !important',
      mt: '24px !important',
      mb: '8px !important',
      w: 'auto',
    },
  },
}
