import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const RadioField: ComponentMultiStyleConfig = {
  parts: [
    'deleteOptionButton',
    'addOptionContainer',
    'addOptionIcon',
    'addOptionButton',
    'previewOptionsContainer',
    'previewOptionRowContainer',
    'radio',
    'radioText',
  ],
  baseStyle: {
    deleteOptionButton: {
      minW: 6,
      h: 6,
      fontSize: '24px',
    },
    addOptionContainer: {
      h: '40px',
    },
    addOptionIcon: {
      fontSize: '24px',
      color: 'neutral.800',
    },
    addOptionButton: {
      color: 'neutral.800',
      textStyle: 'body1',
      fontWeight: '400',
    },
    previewOptionsContainer: {
      alignItems: 'start',
    },
    previewOptionRowContainer: {
      px: 2,
    },
    radio: {
      h: 6,
      w: 6,
      borderColor: 'secondary.500',
    },
    radioText: {
      textStyle: 'body1',
    },
  },
}
