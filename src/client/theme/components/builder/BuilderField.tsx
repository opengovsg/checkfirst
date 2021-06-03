import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

const CommonComponents: ComponentMultiStyleConfig = {
  parts: ['dummyInput'],
  baseStyle: {
    dummyInput: {
      bg: 'neutral.200',
      _disabled: {
        opacity: 1.0,
        cursor: 'not-allowed',
      },
    },
  },
}

export const BuilderField: ComponentMultiStyleConfig = {
  parts: ['container', 'action', 'content', 'badge', ...CommonComponents.parts],
  baseStyle: {
    container: {
      py: 8,
      px: 4,
      w: '100%',
      bg: 'white',
      borderRadius: '3px',
      cursor: 'pointer',
      position: 'relative',
    },
    action: {
      color: 'secondary.500',
      fontSize: '20px',
      _hover: {
        color: 'primary.300',
      },
    },
    badge: {
      w: '40px',
      h: '40px',
      position: 'absolute',
      top: 0,
      left: `-${40 + 16}px`,
      zIndex: 9,
      transition: 'none',
      color: 'neutral.800',
    },
    ...CommonComponents.baseStyle,
  },
  variants: {
    active: ({ colorScheme }) => ({
      container: {
        borderLeft: 'solid 8px',
        borderLeftColor: `${colorScheme}.500`,
        boxShadow: '0px 0px 10px #DADEE3',
        cursor: 'auto',
      },
      badge: {
        left: `-${40 + 8 + 16}px`, // Add 8px for left border
        color: 'white',
      },
      content: {
        mb: 6,
      },
    }),
  },
}
