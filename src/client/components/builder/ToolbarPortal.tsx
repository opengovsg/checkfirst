import { FC } from 'react'
import ReactDOM from 'react-dom'

interface ToolbarPortalProps {
  container: HTMLElement | null
}

export const ToolbarPortal: FC<ToolbarPortalProps> = ({
  container,
  children,
}) => {
  return container ? ReactDOM.createPortal(children, container) : null
}
