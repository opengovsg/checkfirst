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
  // Use no-cache to force re-validation for every request and support
  // 304s if etag remains the same.
  res.setHeader('Cache-Control', 'no-cache')
  // for HTTP1.0 backward compatibility
  res.setHeader('Pragma', 'no-cache')
  next()
}
