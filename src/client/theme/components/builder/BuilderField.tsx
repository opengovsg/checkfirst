const CommonComponents = {
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

export const BuilderField = {
  parts: ['container', 'action', 'content', 'badge', ...CommonComponents.parts],
  baseStyle: {
    container: {
      py: 8,
      px: 4,
      w: '100%',
      bg: 'white',
      borderRadius: '12px',
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
    },
    ...CommonComponents.baseStyle,
  },
  variants: {
    active: {
      container: {
        borderLeft: 'solid 12px',
        borderLeftColor: 'primary.500',
        boxShadow: '0px 0px 10px #DADEE3',
        cursor: 'auto',
      },
      badge: {
        left: `-${40 + 12 + 16}px`, // Add 12px for left border
      },
      content: {
        mb: 6,
      },
    },
  },
}
