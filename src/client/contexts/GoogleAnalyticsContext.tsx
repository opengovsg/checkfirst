import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  GA_USER_EVENTS,
  initializeGA,
  setGAUserId,
  sendPageView,
  sendUserEvent,
  sendTiming,
  sendException,
} from '../services'

interface GoogleAnalyticsContextProps {
  GA_USER_EVENTS: {
    SUBMIT: string
  }
  setGAUserId: (userId: number | null) => void
  sendPageView: (path: string) => void
  sendUserEvent: (action: string, label?: string, value?: number) => void
  sendTiming: (category: string, variable: string, value: number) => void
  sendException: (description: string) => void
}

export const GoogleAnalyticsContext = createContext<
  GoogleAnalyticsContextProps | undefined
>(undefined)

export const useGoogleAnalytics = (): GoogleAnalyticsContextProps => {
  const GoogleAnalytics = useContext(GoogleAnalyticsContext)
  if (!GoogleAnalytics)
    throw new Error(
      'useGoogleAnalytics must be used within an GoogleAnalyticsProvider'
    )
  return GoogleAnalytics
}

export const GoogleAnalyticsProvider: FC = ({ children }) => {
  const [isLoaded, setLoaded] = useState(false)

  const location = useLocation()

  useEffect(() => {
    try {
      initializeGA()
    } catch (err) {
      // TODO write error
    }
    setLoaded(true)
  }, [])

  // when route changes, send page view to GA
  useEffect(() => {
    isLoaded && sendPageView(location.pathname)
  }, [location, isLoaded])

  const ga = {
    GA_USER_EVENTS,
    setGAUserId,
    sendPageView,
    sendUserEvent,
    sendTiming,
    sendException,
  }

  return (
    <GoogleAnalyticsContext.Provider value={ga}>
      {children}
    </GoogleAnalyticsContext.Provider>
  )
}
