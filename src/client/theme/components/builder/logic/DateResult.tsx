import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const DateResult: ComponentMultiStyleConfig = {
  parts: [
    'dateContainer',
    'questionButton',
    'operatorButton',
    'operatorMenuList',
    'menuButtonText',
    'menuRowContainer',
    'menuRowBadge',
    'numberInput',
    'numberField',
    'daysText',
  ],
  baseStyle: {
    dateContainer: {
      justify: 'stretch',
    },
    questionButton: {
      w: '100%',
    },
    operatorButton: {
      w: '80px',
      flexShrink: 0,
    },
    operatorMenuList: {
      minW: '80px',
    },
    menuButtonText: {
      textAlign: 'left',
      textStyle: 'body1',
    },
    menuRowContainer: {
      w: 'inherit',
    },
    menuRowBadge: {
      color: 'white',
      fontSize: 'sm',
      borderRadius: '3px',
    },
    numberInput: {
      w: '96px',
      flexShrink: 0,
    },
    numberField: {
      paddingInline: 4,
    },
    daysText: {
      textStyle: 'subhead3',
    },
  },
}
