export const LineDisplay = {
  parts: ['container', 'label', 'value', 'hyperlinkIcon'],
  baseStyle: {
    container: {
      flexDirection: 'column',
    },
    label: {
      textStyle: 'body2',
      w: '100%',
      color: 'primary.300',
    },
    value: {
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: '32px',
      w: '100%',
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
}
