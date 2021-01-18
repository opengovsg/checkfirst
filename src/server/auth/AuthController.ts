import { Request, Response } from 'express'

import { ip } from '../utils/express'
import AuthService from './AuthService'

export class AuthController {
  private service: Pick<AuthService, 'sendOTP' | 'verifyOTP'>

  constructor(options: {
    service: Pick<AuthService, 'sendOTP' | 'verifyOTP'>
  }) {
    this.service = options.service
  }

  sendOTP: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { email } = req.body
    try {
      await this.service.sendOTP(email, ip(req))
      res.json({ message: 'OTP sent' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  verifyOTP: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { email, token } = req.body
    try {
      const user = await this.service.verifyOTP(email, token)
      if (user) {
        Object.assign(req.session, { user })
        res.json({ message: 'OTP verified' })
      } else {
        res.status(401).json({ message: 'Incorrect OTP given' })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
