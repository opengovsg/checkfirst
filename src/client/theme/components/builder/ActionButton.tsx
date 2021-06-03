import { ComponentSingleStyleConfig } from '@chakra-ui/theme'

export const ActionButton: ComponentSingleStyleConfig = {
  baseStyle: ({ colorScheme }) => ({
    color: `${colorScheme}.500`,
    fontSize: '16px',
    borderRadius: '3px',
  }),
}
