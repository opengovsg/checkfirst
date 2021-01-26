export const BuilderField = {
  parts: ['container', 'action', 'dummyInput', 'content', 'badge'],
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
      color: '#09101D',
      fontSize: '20px',
      _hover: {
        color: '#1B3C87',
      },
    },
    dummyInput: {
      bg: '#F4F6F9',
      _disabled: {
        opacity: 1.0,
        cursor: 'not-allowed',
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
  },
  variants: {
    active: {
      container: {
        borderLeft: 'solid 12px #1B3C87',
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
