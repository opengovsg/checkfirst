import ReactGA from 'react-ga'

const GA_TRACKING_ID = process.env.GA_TRACKING_ID || ''

export const GA_USER_EVENTS = {
  SUBMIT: 'Submit',
}

export function initializeGA() {
  ReactGA.initialize(GA_TRACKING_ID, {
    debug: false, // Set to true only on development
    useExistingGa: true,
  })
  ReactGA.ga('create', GA_TRACKING_ID, 'auto', {
    cookieFlags: 'SameSite=None; Secure',
  })
}

export function setGAUserId(userId: number | null) {
  ReactGA.set({ userId })
}

export function sendPageView(path: string) {
  ReactGA.pageview(path)
}

export function sendUserEvent(action: string, label?: string, value?: number) {
  ReactGA.event({
    category: 'User',
    action,
    label,
    value,
  })
}

export function sendTiming(category: string, variable: string, value: number) {
  ReactGA.timing({
    category,
    variable,
    value: Math.ceil(value), // in integer milliseconds
  })
}

export function sendException(description: string) {
  ReactGA.exception({ description })
}
