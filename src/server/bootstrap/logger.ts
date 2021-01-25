import winston, { createLogger, format, transports } from 'winston'
import config from '../config'

const nodeEnv = config.get('nodeEnv')

const transportFormat =
  nodeEnv == 'development'
    ? format.combine(
        format.colorize(),
        format.printf(
          (info: Record<string, unknown>) =>
            `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    : format.printf(
        (info: Record<string, unknown>) =>
          `${info.timestamp} ${info.level}: ${info.message}`
      )

export const logger: winston.Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: transportFormat,
    }),
  ],
})

export default logger
