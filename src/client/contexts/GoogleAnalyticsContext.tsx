import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { initializeGA, sendPageView } from '../services'

interface GoogleAnalyticsContextProps {
  sendPageView: () => void
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

  return (
    <GoogleAnalyticsContext.Provider value={{}}>
      {children}
    </GoogleAnalyticsContext.Provider>
  )
}
