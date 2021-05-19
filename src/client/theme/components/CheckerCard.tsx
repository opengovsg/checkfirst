export const CheckerCard = {
  parts: ['card', 'title', 'actions'],
  baseStyle: {
    card: {
      h: '200px',
      justifyContent: 'space-between',
      boxShadow: 'md',
      borderRadius: '3px',
      bg: 'white',
      p: '24px',
    },
    title: {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '24px',
      letterSpacing: '-0.011em',
    },
    subtitle: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '16px',
      color: '#A5ABB3',
    },
    actions: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    indicator: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '400',
      color: '#2C3A4B',
      textTransform: 'capitalize',
      alignItems: 'center',
    },
  },
  variants: {
    create: {
      card: {
        bg: 'primary.500',
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
      },
      title: {
        mt: '16px',
      },
    },
  },
}
