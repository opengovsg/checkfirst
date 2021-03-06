/**
 * @file Configuration
 * All defaults can be changed
 */
import convict from 'convict'

/**
 * To require an env var without setting a default,
 * use
 *    default: '',
 *    format: 'required-string',
 *    sensitive: true,
 */
convict.addFormats({
  'required-string': {
    validate: (val: unknown): void => {
      if (val === '') {
        throw new Error('Required value cannot be empty')
      }
    },
    coerce: <T extends unknown>(val: T): T | undefined => {
      if (val === null) {
        return undefined
      }
      return val
    },
  },
})

const config = convict({
  port: {
    doc: 'The port that the service listens on',
    env: 'PORT',
    format: 'int',
    default: 8080,
  },
  mailSuffix: {
    doc: 'The domain suffix expected for e-mail logins',
    env: 'MAIL_SUFFIX',
    format: '*',
    default: '*.gov.sg',
  },
  cookieMaxAge: {
    doc: 'The maximum age for a cookie, expressed in ms',
    env: 'COOKIE_MAX_AGE',
    format: 'int',
    default: 14400000, // 4 hours
  },
  // TODO - change the secrets below so that the defaults have
  // production-appropriate defaults, or no defaults at all, per
  // guidelines for using convict
  sqlitePath: {
    doc: 'The path of the sqlite data file, or blank if in-memory',
    env: 'SQLITE_PATH',
    format: '*',
    default: '/tmp/checkfirst.db',
  },
  otpExpiry: {
    doc: 'The number of seconds that an OTP is valid for a user',
    env: 'OTP_EXPIRY',
    format: 'int',
    default: 300,
  },
  otpSecret: {
    doc: 'A secret string used to generate TOTPs for users',
    env: 'OTP_SECRET',
    format: '*',
    default: 'toomanysecrets',
  },
  sessionSecret: {
    doc: 'A secret string used to generate sessions for users',
    env: 'SESSION_SECRET',
    format: '*',
    default: 'toomanysecrets',
  },
  databaseUrl: {
    doc: 'The database URL to connect to. Optional, uses sqlite if absent',
    env: 'DATABASE_URL',
    format: '*',
    default: '',
  },
  awsRegion: {
    doc: 'The AWS region for SES. Optional, logs mail to console if absent',
    env: 'AWS_REGION',
    format: '*',
    default: '',
  },
  nodeEnv: {
    doc: 'The node environment',
    env: 'NODE_ENV',
    format: '*',
    default: 'development',
  },
  cspReportUri: {
    doc: 'A URI to report CSP violations to.',
    env: 'CSP_REPORT_URI',
    format: '*',
    default: '',
  },
  cspOnlyReportViolations: {
    doc: 'Only report CSP violations, do not enforce.',
    env: 'CSP_ONLY_REPORT_VIOLATIONS',
    format: 'Boolean',
    default: false,
  },
  sentryDns: {
    doc:
      'The Sentry DNS used for bug and error tracking. e.g. `https://12345@sentry.io/12345`',
    env: 'SENTRY_DNS',
    format: '*',
    default: '',
  },
})

export default config
