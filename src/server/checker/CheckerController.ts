import { Request, Response } from 'express'
import CheckerService from './CheckerService'
export class CheckerController {
  private service: CheckerService

  constructor(options: { service: CheckerService }) {
    this.service = options.service
  }

  post: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const checker = req.body
    try {
      const created = await this.service.create(checker)
      if (!created) {
        res.status(422).json({ message: `${checker.id} already exists` })
      } else {
        res.json(checker)
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  get: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const { id } = req.params
    try {
      const checker = await this.service.retrieve(id)
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
    const checker = req.body
    try {
      const count = await this.service.update(id, checker)
      if (!count) {
        res.status(404).json({ message: 'Not Found' })
      } else {
        res.json(checker)
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  delete: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const { id } = req.params
    try {
      const count = await this.service.delete(id)
      if (!count) {
        res.status(404).json({ message: 'Not Found' })
      } else {
        res.json({ message: `${id} deleted` })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
export default CheckerController
