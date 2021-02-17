import React, { FC } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Masthead as M } from 'sgds-govtech-react'
import 'sgds-govtech/css/sgds.css'

type MastheadProps = {
  isSticky?: boolean
  noLink?: boolean
}

export const Masthead: FC<MastheadProps> = ({
  isSticky,
  noLink,
}: MastheadProps) => <M isSticky={isSticky} noLink={noLink} />
export default Masthead
