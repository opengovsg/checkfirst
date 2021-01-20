import React, { useLayoutEffect, useState, useRef } from 'react'

type UsePositionReturnType = [
  ref: React.MutableRefObject<HTMLDivElement | null>,
  offset: { left: number; top: number }
]

export const usePosition = (): UsePositionReturnType => {
  const [offset, setOffset] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  })
  const ref = useRef<HTMLDivElement>(null)
  const handlePositionChange = () => {
    if (ref && ref.current) {
      const { offsetTop, offsetLeft } = ref.current
      const { top, left } = offset

      if (top !== offsetTop || left !== offsetLeft) {
        setOffset({ top: offsetTop, left: offsetLeft })
      }
    }
  }

  useLayoutEffect(() => {
    handlePositionChange()
  })

  return [ref, offset]
}
