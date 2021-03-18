import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { initializeGA, sendPageView, sendUserEvent } from '../services'

interface GoogleAnalyticsContextProps {
  sendUserEvent: (action: string) => void
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

  useEffect(() => {
    isLoaded && sendPageView(location.pathname)
  }, [location, isLoaded])

  const ga = { sendUserEvent }

  return (
    <GoogleAnalyticsContext.Provider value={ga}>
      {children}
    </GoogleAnalyticsContext.Provider>
  )
}
