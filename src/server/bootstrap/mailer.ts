import nodemailer, { SendMailOptions, Transporter } from 'nodemailer'
import { SES } from 'aws-sdk'

import config from '../config'

import logger from './logger'

const region = config.get('awsRegion')

export const mailer: Pick<Transporter, 'sendMail'> = region
  ? nodemailer.createTransport({
      SES: new SES({ region }),
    })
  : {
      sendMail: (options: SendMailOptions) => {
        logger.info(JSON.stringify(options, null, 2))
        return Promise.resolve(options)
      },
    }
export default mailer
