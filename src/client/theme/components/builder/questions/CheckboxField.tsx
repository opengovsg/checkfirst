import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const CheckboxField: ComponentMultiStyleConfig = {
  parts: [
    'deleteOptionButton',
    'addOptionContainer',
    'addOptionIcon',
    'addOptionButton',
    'previewOptionsContainer',
    'previewOptionRowContainer',
    'checkbox',
    'checkboxText',
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
    checkbox: {
      borderColor: 'secondary.500',
    },
    checkboxText: {
      textStyle: 'body1',
    },
  },
}
