export const CheckerCard = {
  parts: ['card', 'title', 'actions'],
  baseStyle: {
    card: {
      h: '160px',
      maxW: '160px',
      textAlign: 'center',
      justifyContent: 'space-between',
      boxShadow: 'md',
      borderRadius: '12px',
      bg: 'white',
      p: 8,
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
    },
    actions: {
      visibility: 'hidden',
      justifyContent: 'center',
      _groupHover: {
        visibility: 'visible',
      },
    },
  },
  variants: {
    create: {
      card: {
        bg: 'primary.500',
        color: 'white',
      },
      title: {
        mt: '16px',
      },
    },
  },
}
