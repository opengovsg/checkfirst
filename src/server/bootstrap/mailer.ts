import nodemailer, { SendMailOptions, Transporter } from 'nodemailer'

import config from '../config'

import logger from './logger'

const nodeEnv = config.get('nodeEnv')
const smtpUrl = config.get('smtpUrl')

export const mailer: Pick<Transporter, 'sendMail'> =
  nodeEnv === 'development'
    ? {
        sendMail: (options: SendMailOptions) => {
          logger.info(options)
          return Promise.resolve(options)
        },
      }
    : nodemailer.createTransport({
        url: smtpUrl,
        pool: true,
        maxMessages: 100,
        maxConnections: 20,
      })
export default mailer
