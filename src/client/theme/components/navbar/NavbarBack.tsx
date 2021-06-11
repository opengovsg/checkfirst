import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const NavbarBack: ComponentMultiStyleConfig = {
  parts: ['button', 'text'],
  baseStyle: {
    button: {
      color: 'secondary.800',
      fontSize: '20px',
      minW: '20px',
    },
    text: {
      textStyle: 'body1',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      maxW: '25vw',
    },
  },
}
