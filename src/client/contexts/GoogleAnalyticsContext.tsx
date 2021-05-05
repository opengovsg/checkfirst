import React, { FC, createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { GoogleAnalyticsService } from '../services'

const {
  GA_USER_EVENTS,
  initializeGA,
  setGAUserId,
  sendPageView,
  sendUserEvent,
  sendTiming,
  sendException,
} = GoogleAnalyticsService

interface GoogleAnalyticsContextProps {
  GA_USER_EVENTS: typeof GA_USER_EVENTS
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
  const location = useLocation()

  useEffect(() => {
    initializeGA()
  }, [])

  // when route changes, send page view to GA
  useEffect(() => {
    sendPageView(location.pathname)
  }, [location])

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
