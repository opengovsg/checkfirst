import path from 'path'
import express, { Express, Request, Response } from 'express'
import { cacheHeaders, noStoreHeaders } from '../bootstrap/cache'

export async function addStaticRoutes(app: Express): Promise<Express> {
  const sendIndex = [
    // We do not want the browser to cache the pages at all to ensure that we
    // always load the latest html.
    noStoreHeaders,
    (_req: Request, res: Response) => {
      res.sendFile(
        path.resolve(__dirname + '/../../../build/client/index.html'),
        {
          lastModified: false,
          etag: false,
        }
      )
    },
  ]

  // Rather than using a catch all '*', we want to avoid serving index.html for static
  // assets that do not exists. Instead we want to return 404s to prevent CloudFlare
  // from caching the results for too long. For e.g., assets/js/missing.js will return
  // index.html with a catch all.
  app.get('/', sendIndex)
  app.get('/login', sendIndex)
  app.get('/c/:id', sendIndex)
  app.get('/dashboard/?*', sendIndex)
  app.get('/builder/?*', sendIndex)

  // Last-Modified headers applies only to static assets like js, images, etc.
  app.use(cacheHeaders)
  app.use(express.static(path.resolve(__dirname + '/../../../build/client')))
  app.use(express.static(path.resolve(__dirname + '/../../../public')))

  return app
}

export default addStaticRoutes
