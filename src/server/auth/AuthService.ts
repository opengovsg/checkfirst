import { IMinimatch } from 'minimatch'
import { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer'
import { totp as totpGlobal } from 'otplib'
import winston from 'winston'

import { User } from '../../types/user'
import { ModelOf } from '../models'

export class AuthService {
  private secret: string
  private emailValidator: IMinimatch
  private totp: Pick<typeof totpGlobal, 'generate' | 'verify' | 'options'>
  private mailer: Pick<Transporter, 'sendMail'>
  private UserModel: ModelOf<User>
  private logger?: winston.Logger

  constructor({
    secret,
    emailValidator,
    totp,
    mailer,
    User,
    logger,
  }: {
    secret: string
    emailValidator: IMinimatch
    totp: Pick<typeof totpGlobal, 'generate' | 'verify' | 'options'>
    mailer: Pick<Transporter, 'sendMail'>
    User: ModelOf<unknown>
    logger?: winston.Logger
  }) {
    this.secret = secret
    this.emailValidator = emailValidator
    this.totp = totp
    this.mailer = mailer
    this.UserModel = User as ModelOf<User>
    this.logger = logger
  }

  private secretFrom: (email: string) => string = (email) => this.secret + email

  sendOTP: (email: string, ip: string) => Promise<SentMessageInfo> = async (
    email,
    ip
  ) => {
    if (!this.emailValidator.match(email)) {
      throw new Error('Invalid email')
    }
    const otp = this.totp.generate(this.secretFrom(email))
    const timeLeft = this.totp.options.step
      ? Math.floor(this.totp.options.step / 60) // Round down to minutes
      : NaN
    const html = `Your OTP is <b>${otp}</b>. It will expire in ${timeLeft} minutes.
    Please use this to login to your account.
    <p>If your OTP does not work, please request for a new one.</p>
    <p>This login attempt was made from the IP: ${ip}. If you did not attempt to log in, you may choose to ignore this email or investigate this IP address further.</p>`

    const mail: SendMailOptions = {
      to: email,
      from: 'CheckFirst.gov.sg <donotreply@mail.checkfirst.gov.sg>',
      subject: 'One-Time Password (OTP) for CheckFirst',
      html,
    }

    this.logger?.info(`Sending mail to ${email}`)
    return this.mailer.sendMail(mail)
  }

  verifyOTP: (
    email: string,
    token: string
  ) => Promise<User | undefined> = async (email, token) => {
    const isVerified = this.totp.verify({
      secret: this.secretFrom(email),
      token,
    })
    const [user] = isVerified
      ? await this.UserModel.findOrCreate({ where: { email } })
      : []

    return user
  }
}

export default AuthService
