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
    doc: 'The database URL to connect to, if NODE_ENV is not development',
    env: 'DATABASE_URL',
    format: '*',
    default: '',
  },
  smtpUrl: {
    doc: 'The SMTP server URL to connect to, if NODE_ENV is not development',
    env: 'SMTP_URL',
    format: '*',
    default: '',
  },
  nodeEnv: {
    doc: 'The node environment',
    env: 'NODE_ENV',
    format: '*',
    default: 'development',
  },
})

export default config
