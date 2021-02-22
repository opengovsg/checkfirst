import { Request, Response } from 'express'
import CheckerService from './CheckerService'
import { CheckerSchema } from './CheckerSchema'

export class CheckerController {
  private service: Pick<CheckerService, keyof CheckerService>

  constructor(options: {
    service: Pick<CheckerService, keyof CheckerService>
  }) {
    this.service = options.service
  }

  post: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const checker = req.body
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
    } else {
      try {
        const { error } = CheckerSchema.validate(checker)
        if (error) throw error

        const created = await this.service.create(checker, user)
        if (!created) {
          res.status(422).json({ message: `${checker.id} already exists` })
        } else {
          res.json(checker)
        }
      } catch (error) {
        res.status(400).json({ message: error.message })
      }
    }
  }

  list: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
    } else {
      try {
        const checkers = await this.service.list(user)
        res.json(checkers)
      } catch (error) {
        res.status(400).json({ message: error.message })
      }
    }
  }

  get: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    try {
      const checker = await this.service.retrieve(id, user)
      if (!checker) {
        res.status(404).json({ message: 'Not Found' })
      } else {
        res.json(checker)
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  put: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
    } else {
      try {
        const checker = req.body
        const { error } = CheckerSchema.validate(checker)
        if (error) throw error

        const count = await this.service.update(id, checker, user)
        if (!count) {
          res.status(404).json({ message: 'Not Found' })
        } else {
          res.json(checker)
        }
      } catch (error) {
        res
          .status(error.message.includes('Unauthorized') ? 403 : 400)
          .json({ message: error.message })
      }
    }
  }

  delete: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
    } else {
      try {
        const count = await this.service.delete(id, user)
        if (!count) {
          res.status(404).json({ message: 'Not Found' })
        } else {
          res.json({ message: `${id} deleted` })
        }
      } catch (error) {
        res
          .status(error.message.includes('Unauthorized') ? 403 : 400)
          .json({ message: error.message })
      }
    }
  }
}
export default CheckerController
