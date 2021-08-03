import { Request, Response } from 'express'
import CheckerService from './CheckerService'
import { CheckerWithMetadataSchema } from './CheckerSchema'

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
        const { error } = CheckerWithMetadataSchema.validate(checker)
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

    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
      return
    }

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
        const { error } = CheckerWithMetadataSchema.validate(checker)
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

  getPublished: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { id } = req.params
    try {
      const checker = await this.service.retrievePublished(id)
      if (!checker) {
        res.status(404).json({ message: 'Not Found' })
      } else {
        res.json(checker)
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  publish: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { id } = req.params
    const checker = req.body
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
      return
    }

    try {
      const { error } = CheckerWithMetadataSchema.validate(checker)
      if (error) throw error

      const publishedChecker = await this.service.publish(id, checker, user)
      res.json(publishedChecker)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  setActive: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { id } = req.params
    const { isActive } = req.body
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
      return
    }

    try {
      await this.service.setActive(id, user, isActive)
      res.json({ isActive: isActive })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  listCollaborators: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { id } = req.params
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
      return
    }

    try {
      const users = await this.service.listCollaborators(id, user)
      res.json(users)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  addCollaborator: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { id } = req.params
    const { collaboratorEmail } = req.body
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
      return
    }

    try {
      await this.service.addCollaborator(id, user, collaboratorEmail)
      res.json()
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  deleteCollaborator: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
  ) => {
    const { id } = req.params
    const { collaboratorEmail } = req.body
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
      return
    }

    try {
      await this.service.deleteCollaborator(id, user, collaboratorEmail)
      res.json()
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
export default CheckerController
