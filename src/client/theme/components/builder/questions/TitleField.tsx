import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const TitleField: ComponentMultiStyleConfig = {
  parts: ['titlePreview', 'descriptionPreview'],
  baseStyle: {
    titlePreview: {
      textStyle: 'heading2',
    },
    descriptionPreview: {
      textStyle: 'body2',
      color: 'secondary.400',
    },
  },
}
