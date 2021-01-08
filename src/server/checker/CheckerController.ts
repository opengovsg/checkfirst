import { Request, Response } from 'express'
export class CheckerController {
  private repository: Record<string, Record<string, unknown>>

  constructor() {
    this.repository = {}
  }

  post: (_req: Request, _res: Response) => void = (req, res) => {
    const checker = req.body
    if (this.repository[checker.id]) {
      res.status(400).send({ message: `${checker.id} already exists` })
    } else {
      this.repository[checker.id] = checker
      res.send(checker)
    }
  }

  get: (_req: Request, _res: Response) => void = (req, res) => {
    const { id } = req.params
    const checker = this.repository[id]
    if (!checker) {
      res.status(404).send({ message: 'Not Found' })
    } else {
      res.send(checker)
    }
  }

  put: (_req: Request, _res: Response) => void = (req, res) => {
    const { id } = req.params
    if (!this.repository[id]) {
      res.status(404).send({ message: 'Not Found' })
    } else {
      const checker = req.body
      this.repository[id] = checker
      res.send(checker)
    }
  }

  delete: (_req: Request, _res: Response) => void = (req, res) => {
    const { id } = req.params
    const deleted = this.repository[id]
    if (!deleted) {
      res.status(404).send({ message: 'Not Found' })
    } else {
      delete this.repository[id]
      res.send(deleted)
    }
  }
}
export default CheckerController
