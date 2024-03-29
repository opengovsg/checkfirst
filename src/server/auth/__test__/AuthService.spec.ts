import minimatch from 'minimatch'
import { Sequelize } from 'sequelize-typescript'
import { AuthService } from '..'
import {
  Checker as CheckerModel,
  User as UserModel,
  UserToChecker as UserToCheckerModel,
  PublishedChecker as PublishedCheckerModel,
} from '../../database/models'

describe('AuthService', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: undefined,
    models: [
      UserModel,
      CheckerModel,
      UserToCheckerModel,
      PublishedCheckerModel,
    ],
  })

  const totp = {
    generate: jest.fn(),
    verify: jest.fn(),
    options: { step: 60 },
  }
  const secret = 'toomanysecrets'
  const appHost = 'checkfirst.gov.sg'
  const emailValidator = new minimatch.Minimatch('*.gov.sg')
  const mailer = { sendMail: jest.fn() }

  const sequelizeReady = sequelize.sync()

  const service = new AuthService({
    secret,
    appHost,
    emailValidator,
    totp,
    mailer,
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
    it.each([
      'nongovernment@valid.com.sg',
      'user@agency.gov.sg',
      'user@test.gov.sg',
    ])('should support multiple whitelisted domains', async (email) => {
      const otp = '111111'
      const ip = '192.168.0.1'
      totp.generate.mockReturnValue(otp)

      const mailSuffix = '@(*.gov.sg|*@valid.com.sg)'
      const multiDomainValidator = new minimatch.Minimatch(mailSuffix, {
        noglobstar: true,
        nobrace: true,
        nonegate: true,
      })
      const auth = new AuthService({
        secret,
        appHost,
        emailValidator: multiDomainValidator,
        totp,
        mailer,
      })

      auth.sendOTP(email, ip)
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
    it.each([
      'user@subdomain.valid.com.sg',
      'user@invalid.com.sg',
      'user@valid.com.sg.sg',
    ])(
      'rejects invalid email with multiple whitelisted domain provided',
      async (email) => {
        const otp = '111111'
        const ip = '192.168.0.1'
        totp.generate.mockReturnValue(otp)

        const mailSuffix = '@(*.gov.sg|*@valid.com.sg)'
        const multiDomainValidator = new minimatch.Minimatch(mailSuffix, {
          noglobstar: true,
          nobrace: true,
          nonegate: true,
        })
        const auth = new AuthService({
          secret,
          appHost,
          emailValidator: multiDomainValidator,
          totp,
          mailer,
        })

        await expect(() => auth.sendOTP(email, ip)).rejects.toThrowError()
        expect(totp.generate).not.toHaveBeenCalled()
        expect(mailer.sendMail).not.toHaveBeenCalled()
      }
    )
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
