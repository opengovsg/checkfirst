export const QuestionField = {
  parts: ['container', 'action', 'dummyInput'],
  baseStyle: {
    container: {
      py: 8,
      px: 4,
      w: '100%',
      bg: 'white',
      borderRadius: '12px',
      cursor: 'pointer',
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
  },
  variants: {
    active: {
      container: {
        borderLeft: 'solid 12px #1B3C87',
        boxShadow: '0px 0px 10px #DADEE3',
        cursor: 'auto',
      },
    },
  },
}
