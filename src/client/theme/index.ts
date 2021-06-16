import { extendTheme } from '@chakra-ui/react'

import { colors, fonts } from './foundations'
import { textStyles } from './text-styles'
import { layerStyles } from './layer-styles'

import { components } from './components'

export const theme = extendTheme({
  colors,
  fonts,
  textStyles,
  layerStyles,
  components,
})
