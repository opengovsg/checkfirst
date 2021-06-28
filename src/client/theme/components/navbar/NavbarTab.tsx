import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const NavbarTab: ComponentMultiStyleConfig = {
  parts: ['tab', 'text'],
  baseStyle: {
    tab: {
      p: 0,
      pb: '6px',
      mx: 4,
      mb: '-3px',
      borderBottom: 0,
      borderColor: 'primary.500',
    },
    text: {
      textStyle: 'subhead3',
      textColor: 'primary.300',
    },
  },
  variants: {
    selected: {
      tab: {
        pb: 1,
        borderBottom: '2px',
      },
      text: {
        textColor: 'primary.500',
      },
    },
  },
}
