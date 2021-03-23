import ReactGA from 'react-ga'

const GA_TRACKING_ID = process.env.GA_TRACKING_ID || ''

const GA_USER_EVENTS = {
  SUBMIT: 'Submit',
}

const initializeGA = (): void => {
  ReactGA.initialize(GA_TRACKING_ID, {
    debug: false, // Set to true only on development
    useExistingGa: true,
  })
  ReactGA.ga('create', GA_TRACKING_ID, 'auto', {
    cookieFlags: 'SameSite=None; Secure',
  })
}

const setGAUserId = (userId: number | null): void => {
  ReactGA.set({ userId })
}

const sendPageView = (path: string): void => {
  ReactGA.pageview(path)
}

const sendUserEvent = (
  action: string,
  label?: string,
  value?: number
): void => {
  ReactGA.event({
    category: 'User',
    action,
    label,
    value,
  })
}

const sendTiming = (
  category: string,
  variable: string,
  value: number
): void => {
  ReactGA.timing({
    category,
    variable,
    value: Math.ceil(value), // in integer milliseconds
  })
}

const sendException = (description: string): void => {
  ReactGA.exception({ description })
}

export const GoogleAnalyticsService = {
  GA_USER_EVENTS,
  initializeGA,
  setGAUserId,
  sendPageView,
  sendUserEvent,
  sendTiming,
  sendException,
}
