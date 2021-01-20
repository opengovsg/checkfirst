import { extendTheme } from '@chakra-ui/react'

import { fonts } from './fonts'
import { colors } from './colors'
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
