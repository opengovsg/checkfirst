import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const MapTable: ComponentMultiStyleConfig = {
  parts: [
    'fieldContainer',
    'table',
    'tableHead',
    'tableHeadText',
    'tableCell',
    'tableInput',
    'deleteCell',
    'deleteButton',
    'addRowButton',
    'previewTableBody',
  ],
  baseStyle: {
    fieldContainer: {
      mb: -2,
    },
    table: {
      background: 'neutral.200',
    },
    tableHead: {
      py: 4,
    },
    tableHeadText: {
      textTransform: 'none',
      textColor: 'secondary.500',
      textStyle: 'tablehead',
    },
    tableCell: {
      px: 2,
      pt: 2,
      pb: 1,
    },
    tableInput: {
      background: 'white',
      w: '100%',
    },
    deleteCell: {
      px: 0,
      pt: 2,
      pb: 1,
      w: '48px',
    },
    deleteButton: {
      fontSize: '20px',
    },
    addRowButton: {
      w: 'fit-content',
    },
    previewTableBody: {
      background: 'white',
    },
  },
}
