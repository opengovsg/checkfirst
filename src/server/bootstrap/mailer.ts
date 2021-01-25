import nodemailer, { SendMailOptions, Transporter } from 'nodemailer'

import config from '../config'

import logger from './logger'

const smtpUrl = config.get('smtpUrl')

export const mailer: Pick<Transporter, 'sendMail'> = smtpUrl
  ? nodemailer.createTransport({
      url: smtpUrl,
      pool: true,
      maxMessages: 100,
      maxConnections: 20,
    })
  : {
      sendMail: (options: SendMailOptions) => {
        logger.info(JSON.stringify(options, null, 2))
        return Promise.resolve(options)
      },
    }
export default mailer
