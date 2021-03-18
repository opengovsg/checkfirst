import helmet from 'helmet'
import config from '../config'
import parseDomain from '../utils/domain'

const cspOnlyReportViolations = config.get('cspOnlyReportViolations')
const cspReportUri = config.get('cspReportUri')
const sentryDns = config.get('sentryDns')

export default helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com/'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com/'],
      connectSrc: [
        "'self'",
        ...(sentryDns ? [parseDomain(sentryDns)] : []),
        'https://www.google-analytics.com',
      ],
      ...(cspReportUri ? { reportUri: cspReportUri } : {}),
      upgradeInsecureRequests: [],
    },
    reportOnly: cspOnlyReportViolations,
  },
  frameguard: false,
})
