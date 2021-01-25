import bootstrap, { logger } from './bootstrap'
import config from './config'

const port = config.get('port')
bootstrap().then((app) =>
  app.listen(port, () => logger.info(`Listening on port ${port}`))
)
