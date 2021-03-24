import helmet from 'helmet'
import config from '../config'
import parseDomain from '../utils/domain'

const cspOnlyReportViolations = config.get('cspOnlyReportViolations')
const cspReportUri = config.get('cspReportUri')
const frontendSentryDsn = config.get('frontendSentryDsn')

export default helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com/'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com/'],
      connectSrc: [
        "'self'",
        ...(frontendSentryDsn ? [parseDomain(frontendSentryDsn)] : []),
        'https://www.google-analytics.com',
      ],
      scriptSrc: ["'self'", 'https://www.google-analytics.com'],
      scriptSrcElem: ["'self'", 'https://www.google-analytics.com'],
      imgSrc: ["'self'", 'https://www.google-analytics.com'],
      ...(cspReportUri ? { reportUri: cspReportUri } : {}),
      upgradeInsecureRequests: [],
    },
    reportOnly: cspOnlyReportViolations,
  },
  frameguard: false,
})
