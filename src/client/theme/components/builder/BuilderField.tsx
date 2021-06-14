import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

const CommonComponents: ComponentMultiStyleConfig = {
  parts: [
    'dummyInput',
    'fieldInput',
    'expressionInput',
    'inputIconElement',
    'fullWidthContainer',
    'halfWidthContainer',
    'previewTitle',
    'previewDescription',
  ],
  baseStyle: {
    dummyInput: {
      bg: 'neutral.200',
      _disabled: {
        opacity: 1.0,
        cursor: 'not-allowed',
      },
    },
    fieldInput: {
      textStyle: 'body1',
    },
    expressionInput: {
      fontFamily: 'mono',
    },
    inputIconElement: {
      pointerEvents: 'none',
      fontSize: '16px',
      pl: 1,
    },
    fullWidthContainer: {
      alignItems: 'stretch',
      width: '100%',
    },
    halfWidthContainer: {
      alignItems: 'stretch',
      width: '50%',
    },
    previewTitle: {
      textStyle: 'subhead1',
      fontWeight: 500,
    },
    previewDescription: {
      textStyle: 'body2',
      color: 'secondary.400',
    },
  },
}

export const BuilderField: ComponentMultiStyleConfig = {
  parts: [
    'container',
    'content',
    'badge',
    'actionBar',
    'barSpacer',
    ...CommonComponents.parts,
  ],
  baseStyle: {
    container: {
      w: '100%',
      bg: 'white',
      borderRadius: '3px',
      cursor: 'pointer',
      position: 'relative',
    },
    content: {
      p: 8,
    },
    badge: {
      w: '40px',
      h: '40px',
      position: 'absolute',
      top: 0,
      left: `-${40 + 16}px`,
      zIndex: 9,
      transition: 'none',
      color: 'neutral.800',
    },
    actionBar: {
      h: 12,
      px: 4,
      borderTop: 'solid 1px',
      borderTopColor: 'secondary.200',
      justifyContent: 'flex-end',
    },
    barSpacer: {
      h: 2,
    },
    logicCaption: {
      pl: 2,
      color: 'neutral.500',
      textStyle: 'caption1',
      fontStyle: 'italic',
    },
    ...CommonComponents.baseStyle,
  },
  variants: {
    active: ({ colorScheme }) => ({
      container: {
        borderLeft: 'solid 8px',
        borderLeftColor: `${colorScheme}.500`,
        boxShadow: '0px 0px 10px #DADEE3',
        cursor: 'auto',
      },
      badge: {
        left: `-${40 + 8 + 16}px`, // Add 8px for left border
        color: 'white',
      },
      content: {
        pl: 6,
        pb: 6,
      },
    }),
  },
}
