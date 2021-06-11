import { builder } from './builder'
import { navbar } from './navbar'
import { FloatingToolbar } from './FloatingToolbar'
import { CheckerCard } from './CheckerCard'
import { Checker } from './Checker'
import { LineDisplay } from './LineDisplay'
import { StyledToast } from './StyledToast'

export const components = {
  ...builder,
  ...navbar,
  FloatingToolbar,
  CheckerCard,
  Checker,
  LineDisplay,
  StyledToast,
}
