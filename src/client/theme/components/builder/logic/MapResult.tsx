import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const MapResult: ComponentMultiStyleConfig = {
  parts: [
    'mapContainer',
    'mapText',
    'menuButton',
    'menuButtonText',
    'menuList',
    'menuRowContainer',
    'menuRowBadge',
    'toText',
  ],
  baseStyle: {
    mapContainer: {
      justify: 'stretch',
    },
    mapText: {
      w: '48px',
      textStyle: 'subhead3',
      flexShrink: 0,
    },
    menuButton: {
      w: '50%',
    },
    menuButtonText: {
      textStyle: 'body1',
      textAlign: 'left',
    },
    menuList: {
      w: 'inherit',
    },
    menuRowContainer: {
      w: 'inherit',
    },
    menuRowBadge: {
      color: 'white',
      fontSize: 'sm',
      borderRadius: '3px',
    },
    toText: {
      w: '48px',
      textAlign: 'center',
      textStyle: 'subhead3',
      flexShrink: 0,
    },
  },
}
