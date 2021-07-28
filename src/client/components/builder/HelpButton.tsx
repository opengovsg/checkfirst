import { OutboundLink } from 'react-ga'
import React, { FC, useEffect, useRef, useState } from 'react'
import {
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Portal,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react'
import { Text } from '@chakra-ui/layout'
import {
  BiArrowBack,
  BiCalculator,
  BiCalendar,
  BiGitBranch,
  BiGitCompare,
  BiQuestionMark,
  BiRadioCircleMarked,
  BiTable,
} from 'react-icons/bi'
import {
  FiAtSign,
  HiHashtag,
  IoEyeOutline,
  RiArrowRightSLine,
  RiCheckboxMultipleBlankFill,
} from 'react-icons/all'
import { useGoogleAnalytics } from '../../contexts'
import { DefaultTooltip } from '../common/DefaultTooltip'
import { useRouteMatch } from 'react-router-dom'

import { IconType } from 'react-icons'

// States denoting the pages of the help button menu popover
enum PopoverTabState {
  Overall = '',
  Questions = 'questions',
  Constants = 'constants',
  Logic = 'logic',
}

// Data type for help button menu links
type HelpLink = {
  title: string
  link: string
  icon: IconType
}

export const HelpButton: FC = () => {
  const { GA_USER_EVENTS } = useGoogleAnalytics()
  const { url } = useRouteMatch()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const popoverRef = useRef<HTMLDivElement>(null)

  const [currentTabState, setTabState] = useState(PopoverTabState.Overall)

  // Set initial help button menu page based on action in the url
  useEffect(() => {
    const currentTab = (url.split('/').pop() ||
      '') as unknown as PopoverTabState
    setTabState(currentTab)
  }, [url])

  // Force-close popover when clicking anywhere outside popover element
  useOutsideClick({
    ref: popoverRef,
    handler: onClose,
  })

  const questionTabs: HelpLink[] = [
    {
      title: 'Numeric',
      link: 'https://guide.checkfirst.gov.sg/features/form-builder#question-types',
      icon: HiHashtag,
    },
    {
      title: 'Radio question',
      link: 'https://guide.checkfirst.gov.sg/features/form-builder#question-types',
      icon: BiRadioCircleMarked,
    },
    {
      title: 'Checkbox question',
      link: 'https://guide.checkfirst.gov.sg/features/form-builder#question-types',
      icon: RiCheckboxMultipleBlankFill,
    },
    {
      title: 'Date question',
      link: 'https://guide.checkfirst.gov.sg/features/form-builder#question-types',
      icon: BiCalendar,
    },
  ]

  const constantTableTabs: HelpLink[] = [
    {
      title: 'Constant tables',
      link: 'https://guide.checkfirst.gov.sg/features/constants',
      icon: BiTable,
    },
  ]

  const logicTabs: HelpLink[] = [
    {
      title: 'Referencing questions',
      link: 'https://guide.checkfirst.gov.sg/features/logic#referencing-blocks',
      icon: FiAtSign,
    },
    {
      title: 'Hide/show results',
      link: 'https://guide.checkfirst.gov.sg/features/logic#how-to-use-logic',
      icon: IoEyeOutline,
    },
    {
      title: 'Calculated logic',
      link: 'https://guide.checkfirst.gov.sg/features/logic/calculator-logic',
      icon: BiCalculator,
    },
    {
      title: 'Conditional logic',
      link: 'https://guide.checkfirst.gov.sg/features/logic/conditional-logic',
      icon: BiGitBranch,
    },
    {
      title: 'Date logic',
      link: 'https://guide.checkfirst.gov.sg/features/logic/date-logic',
      icon: BiCalendar,
    },
    {
      title: 'Map constant table',
      link: 'https://guide.checkfirst.gov.sg/features/logic/map-constant',
      icon: BiGitCompare,
    },
  ]

  // Component list of menu item links for the question, constant table and logic pages
  type LinksProps = {
    helpLinks: HelpLink[]
  }
  const Links: FC<LinksProps> = ({ helpLinks }) => {
    const listItems = helpLinks.map((helpLink) => {
      return (
        <ListItem key={helpLink.title}>
          <ListIcon as={helpLink.icon} color="grey" />
          <OutboundLink
            eventLabel={GA_USER_EVENTS.BUILDER_HELP_BUTTON}
            to={helpLink.link}
            target="_blank"
          >
            <Button color="primary.500" variant="link" px="10px">
              <Text fontSize="16px" fontWeight={400}>
                {helpLink.title}
              </Text>
            </Button>
          </OutboundLink>
        </ListItem>
      )
    })

    if (currentTabState === PopoverTabState.Logic)
      listItems.splice(2, 0, <Divider key="divider" />)

    return (
      <List spacing={5} px="10px" py="7px">
        {listItems}
      </List>
    )
  }

  // Component list of menu item links for overview page
  const OverviewLinks: FC = () => {
    const overviewListItem = (title: string, linkTo: PopoverTabState) => {
      return (
        <ListItem
          display="flex"
          onClick={() => setTabState(linkTo)}
          key={title}
        >
          <Button color="primary.500" variant="link" px="10px">
            <Text fontSize="14px" fontWeight={600}>
              {title}
            </Text>
          </Button>
          <Spacer />
          <RiArrowRightSLine color="grey" />
        </ListItem>
      )
    }

    return (
      <List spacing={5} px="10px" py="7px">
        {overviewListItem('QUESTIONS TAB', PopoverTabState.Questions)}
        {overviewListItem('CONSTANTS TAB', PopoverTabState.Constants)}
        {overviewListItem('LOGIC TAB', PopoverTabState.Logic)}
      </List>
    )
  }

  // Component with logic to display menu items based on current page
  type PopoverStateProps = {
    currentTab: PopoverTabState | undefined
  }
  const PopoverLinks: FC<PopoverStateProps> = ({ currentTab }) => {
    switch (currentTab) {
      case PopoverTabState.Overall:
        return <OverviewLinks />
      case PopoverTabState.Questions:
        return <Links helpLinks={questionTabs} />
      case PopoverTabState.Constants:
        return <Links helpLinks={constantTableTabs} />
      case PopoverTabState.Logic:
        return <Links helpLinks={logicTabs} />
      default:
        return <OverviewLinks />
    }
  }

  // Component to display popover header based on current page
  const PopoverTitle: FC<PopoverStateProps> = ({ currentTab }) => {
    if (currentTab === PopoverTabState.Overall) {
      return (
        <Text fontSize="14px" fontWeight={600}>
          HELP & RESOURCES
        </Text>
      )
    } else {
      return (
        <HStack>
          <IconButton
            aria-label="More guides"
            variant="link"
            icon={<BiArrowBack />}
            onClick={() => setTabState(PopoverTabState.Overall)}
          />
          <Text fontSize="14px" fontWeight={600}>
            MORE GUIDES
          </Text>
        </HStack>
      )
    }
  }

  return (
    <Flex position="fixed" left="40px" bottom="40px">
      <Popover
        placement="top-end"
        isLazy
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      >
        <DefaultTooltip label="Help & Resources">
          <PopoverTrigger>
            <IconButton
              aria-label="Open guide"
              icon={<BiQuestionMark color="white" size="24px" />}
              isRound
              bg="primary.500"
              _hover={{ color: 'primary.500' }}
              variant="solid"
            />
          </PopoverTrigger>
        </DefaultTooltip>

        <Portal>
          <PopoverContent height="350px" ref={popoverRef}>
            <PopoverCloseButton />
            <PopoverHeader>
              <PopoverTitle currentTab={currentTabState} />
            </PopoverHeader>
            <PopoverBody>
              <PopoverLinks currentTab={currentTabState} />
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  )
}
