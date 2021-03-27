import minimatch from 'minimatch'
import { Sequelize } from 'sequelize'
import { init } from '../../models/User'
import { AuthService } from '..'

describe('AuthService', () => {
  const sequelize = new Sequelize({ dialect: 'sqlite', logging: undefined })

  const totp = {
    generate: jest.fn(),
    verify: jest.fn(),
    options: { step: 60 },
  }
  const secret = 'toomanysecrets'
  const emailValidator = new minimatch.Minimatch('*.gov.sg')
  const mailer = { sendMail: jest.fn() }
  const User = init(sequelize, { emailValidator })

  const sequelizeReady = sequelize.authenticate()

  const service = new AuthService({
    secret,
    emailValidator,
    totp,
    mailer,
    User,
  })

  describe('sendOTP', () => {
    beforeEach(() => {
      totp.generate.mockReset()
      mailer.sendMail.mockReset()
    })
    it('sends mail on valid email', () => {
      const email = 'user@agency.gov.sg'
      const otp = '111111'
      const ip = '192.168.0.1'
      totp.generate.mockReturnValue(otp)
      // We deliberately skip the await here, as jest
      // does not want to play nicely with Node's util.promisify
      service.sendOTP(email, ip)
      expect(totp.generate).toHaveBeenCalledWith(secret + email)
      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          html: expect.stringContaining(otp),
        })
      )
      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          html: expect.stringContaining(ip),
        })
      )
      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          html: expect.stringContaining(
            Math.floor(totp.options.step / 60) + ' minutes'
          ),
        })
      )
    })
    it('rejects invalid email', async () => {
      const email = 'nongovernment@polytechnic.edu.sg'
      const otp = '111111'
      const ip = '192.168.0.1'
      totp.generate.mockReturnValue(otp)
      await expect(() => service.sendOTP(email, ip)).rejects.toThrowError()
      expect(totp.generate).not.toHaveBeenCalled()
      expect(mailer.sendMail).not.toHaveBeenCalled()
    })
  })

  describe('verifyOTP', () => {
    const user = { email: 'user@agency.gov.sg' }
    const token = '111111'
    beforeAll(async () => {
      await sequelizeReady
    })
    it('returns user on successful verify', async () => {
      totp.verify.mockReturnValue(true)
      await expect(service.verifyOTP(user.email, token)).resolves.toMatchObject(
        user
      )
      expect(totp.verify).toHaveBeenCalledWith({
        secret: secret + user.email,
        token,
      })
    })
    it('returns nothing on failed verify', async () => {
      totp.verify.mockReturnValue(false)
      await expect(
        service.verifyOTP(user.email, token)
      ).resolves.toBeUndefined()
      expect(totp.verify).toHaveBeenCalledWith({
        secret: secret + user.email,
        token,
      })
    })
  })
})
