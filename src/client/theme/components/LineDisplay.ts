export const LineDisplay = {
  parts: ['container', 'label', 'value', 'hyperlinkIcon'],
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
      textAlign: { base: 'left', md: 'right' },
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: '32px',
    },
    hyperlink: {
      textDecorationLine: 'underline',
    },
    hyperlinkIcon: {
      mx: 0,
      ml: 1,
      mb: 0.5,
      boxSize: 4,
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
        textAlign: 'left',
      },
    },
  },
}
