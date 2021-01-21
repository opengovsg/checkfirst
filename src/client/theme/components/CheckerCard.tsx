export const CheckerCard = {
  parts: ['card', 'title'],
  baseStyle: {
    card: {
      w: '156px',
      h: '160px',
      textAlign: 'center',
      justifyContent: 'center',
      boxShadow: 'md',
      borderRadius: '12px',
      cursor: 'pointer',
      bg: 'white',
    },
    title: {
      mt: '34px',
      fontSize: '16px',
      fontWeight: '600',
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
