import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const NavbarContainer: ComponentMultiStyleConfig = {
  parts: ['navbar', 'leftElement', 'centerElement', 'rightElement'],
  baseStyle: {
    navbar: {
      h: '73px', // +1 for border
      w: '100%',
      px: 8,
      direction: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      bgColor: 'white',
      borderBottom: 'solid 1px',
      borderColor: 'neutral.300',
      position: 'fixed',
      zIndex: 999,
    },
    leftElement: {
      mr: 'auto',
      flex: 1,
      justifyContent: 'flex-start',
    },
    centerElement: {
      flex: 1,
      justifyContent: 'center',
    },
    rightElement: {
      ml: 'auto',
      flex: 1,
      justifyContent: 'flex-end',
    },
  },
  variants: {
    preview: {
      navbar: {
        bgColor: 'primary.100',
      },
    },
  },
}
