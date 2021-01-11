import { Request, Response } from 'express'
import CheckerService from './CheckerService'
export class CheckerController {
  private service: CheckerService

  constructor(options: { service: CheckerService }) {
    this.service = options.service
  }

  post: (_req: Request, _res: Response) => Promise<void> = async (req, res) => {
    const checker = req.body
    try {
      const created = await this.service.create(checker)
      if (!created) {
        res.status(422).send({ message: `${checker.id} already exists` })
      } else {
        res.send(checker)
      }
    } catch (error) {
      res.status(400).send({ message: error.message })
    }
  }

  get: (_req: Request, _res: Response) => Promise<void> = async (req, res) => {
    const { id } = req.params
    try {
      const checker = await this.service.retrieve(id)
      if (!checker) {
        res.status(404).send({ message: 'Not Found' })
      } else {
        res.send(checker)
      }
    } catch (error) {
      res.status(400).send({ message: error.message })
    }
  }

  put: (_req: Request, _res: Response) => Promise<void> = async (req, res) => {
    const { id } = req.params
    const checker = req.body
    try {
      const count = await this.service.update(id, checker)
      if (!count) {
        res.status(404).send({ message: 'Not Found' })
      } else {
        res.send(checker)
      }
    } catch (error) {
      res.status(400).send({ message: error.message })
    }
  }

  delete: (_req: Request, _res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { id } = req.params
    try {
      const count = await this.service.delete(id)
      if (!count) {
        res.status(404).send({ message: 'Not Found' })
      } else {
        res.send({ message: `${id} deleted` })
      }
    } catch (error) {
      res.status(400).send({ message: error.message })
    }
  }
}
export default CheckerController
