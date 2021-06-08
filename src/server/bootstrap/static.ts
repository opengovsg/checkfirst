import path from 'path'
import express, { Express, Request, Response } from 'express'
import { cacheHeaders } from '../bootstrap/cache'

export async function addStaticRoutes(app: Express): Promise<Express> {
  app.use(cacheHeaders)
  app.use(express.static(path.resolve(__dirname + '/../../../build/client')))
  app.use(express.static(path.resolve(__dirname + '/../../../public')))

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + '/../../../build/client/index.html'))
  })

  return app
}

export default addStaticRoutes
