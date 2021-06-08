import config from '../config'
import { Request, Response, NextFunction } from 'express'

export function cacheHeaders(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const modified = new Date(config.get('deployTimestamp')).toUTCString()
  res.setHeader('Last-Modified', modified)
  next()
}

export function noCacheHeaders(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prevent caching at all and set max-age to 0 to invalidate existing cache.
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  next()
}
