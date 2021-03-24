import { Request, Response } from 'express'
import TemplateService from './TemplateService'

export class TemplateController {
  private service: Pick<TemplateService, keyof TemplateService>

  constructor(options: {
    service: Pick<TemplateService, keyof TemplateService>
  }) {
    this.service = options.service
  }

  list: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
    } else {
      try {
        const templates = await this.service.list()
        res.json(templates)
      } catch (error) {
        res.status(400).json({ message: error.message })
      }
    }
  }

  get: (req: Request, res: Response) => Promise<void> = async (req, res) => {
    const { user } = req.session
    if (!user) {
      res.status(401).json({ message: 'User not signed in' })
    } else {
      try {
        const { id } = req.params
        const template = await this.service.retrieve(+id)
        if (!template) {
          res.status(404).json({ message: 'Not Found' })
        } else {
          res.json(template)
        }
      } catch (error) {
        res.status(400).json({ message: error.message })
      }
    }
  }
}
