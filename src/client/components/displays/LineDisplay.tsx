import React, { FC, ReactNodeArray } from 'react'
import { Icon, Link, Stack, Text, useMultiStyleConfig } from '@chakra-ui/react'
import { BiLinkExternal } from 'react-icons/bi'

// If the value is over this threshold, the result will be rendered as horizontal
// regardless of whether it is in mobile view.
const OVERFLOW_LENGTH = 25

interface LineDisplayProps {
  label: string
  value: string
}

export const LineDisplay: FC<LineDisplayProps> = ({ label, value }) => {
  const isOverflow = value.length > OVERFLOW_LENGTH
  const styles = useMultiStyleConfig('LineDisplay', {
    variant: isOverflow ? 'column' : 'base',
  })

  const linkParser = (value: string) => {
    const linkRegex = /link\(.*\)/g
    const outputNode: ReactNodeArray = []
    let lastStartIndex = 0
    let keyIndex = 0

    let match: RegExpExecArray | null
    while ((match = linkRegex.exec(value)) !== null) {
      // add regular text before any link matches
      outputNode.push(value.slice(lastStartIndex, match.index))
      lastStartIndex = match.index + match[0].length

      const linkParams = match[0]
        .slice(5, match[0].length - 1) // remove 'link(' and ')'
        .split(',') // split params
        .map((str) => str.trim().replace(/['"]/g, '')) // remove string quotes from params

      // turn incomplete links into valid ones (e.g 'www.google.com')
      const getValidLink = (link: string) => {
        if (!link.startsWith('https://') && !link.startsWith('http://')) {
          return `https://${link}`
        }

        return link
      }

      outputNode.push(
        <Link
          key={keyIndex++}
          href={getValidLink(linkParams[1])}
          isExternal
          sx={styles.hyperlink}
        >
          {linkParams[0]}
          <Icon as={BiLinkExternal} sx={styles.hyperlinkIcon} />
        </Link>
      )
    }
    // add text after links (if it exists)
    outputNode.push(value.slice(lastStartIndex))

    return outputNode
  }

  return (
    <Stack sx={styles.container} spacing="8px">
      <Text sx={styles.label}>{label}</Text>
      <Text sx={styles.value}>{linkParser(value)}</Text>
    </Stack>
  )
}
