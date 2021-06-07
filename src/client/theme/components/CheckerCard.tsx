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
      textStyle: 'subhead1',
    },
    subtitle: {
      textStyle: 'caption1',
      color: 'neutral.500',
    },
    actions: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    indicator: {
      textStyle: 'caption1',
      color: 'neutral.900',
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
