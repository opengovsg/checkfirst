export const LineDisplay = {
  parts: ['container', 'label', 'value'],
  baseStyle: {
    container: {
      flexDirection: { base: 'column', md: 'row' },
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: '16px',
      lineHeight: '24px',
      w: { base: '100%', md: '75%' },
    },
    value: {
      w: { base: '100%', md: '25%' },
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: '32px',
    },
  },
  variants: {
    column: {
      container: {
        flexDirection: 'column',
      },
      label: {
        w: '100%',
      },
      value: {
        w: '100%',
      },
    },
  },
}
