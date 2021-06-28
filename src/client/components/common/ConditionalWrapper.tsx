import React, { FC, ReactNode } from 'react'

type Wrapper = (children: React.ReactNode) => React.ReactNode

interface ConditionalWrapperProps {
  condition: boolean
  wrapper: Wrapper
  children: ReactNode // T
}

/**
 * A convenience component for conditionally wrapping a DOM node
 * within another DOM node without duplicating code
 *
 * Referenced from https://blog.hackages.io/conditionally-wrap-an-element-in-react-a8b9a47fab2
 * @param condition A boolean that controls whether `wrapper` is applied
 * @param wrapper A function that should take in the `children` passed into Conditional Wrapper
 * and return the same `children` wrapped in another DOM node.
 * @param children The child node of this component.
 * @returns The result of `wrapper` or just the child node of this component, depending on `condition`.
 */
export const ConditionalWrapper: FC<ConditionalWrapperProps> = ({
  condition,
  wrapper,
  children,
}) => <>{condition ? wrapper(children) : children}</>
