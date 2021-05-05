import { useState } from 'react'
import { Field, Constant, Operation } from '../../types/checker'

const useActiveIndex = (
  items: Operation[] | Field[] | Constant[]
): [number, (nextIndex: number) => void] => {
  // Select first item by default if there are 1 or more items.
  const [activeIndex, updateActiveIndex] = useState<number>(() =>
    items.length > 0 ? 0 : -1
  )

  const setActiveIndex = (nextIndex: number) => {
    updateActiveIndex((prevIndex) => {
      // The only time we want to allow setting activeIndex to -1 is when there are no
      // more items left.
      const isRemoveLastItem =
        prevIndex === 0 && nextIndex === -1 && items.length === 1
      return isRemoveLastItem ? -1 : Math.max(nextIndex, 0)
    })
  }

  return [activeIndex, setActiveIndex]
}

export default useActiveIndex
