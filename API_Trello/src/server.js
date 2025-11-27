import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import 'dotenv/config'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import compression from 'compression'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  // Security: Set various HTTP headers
  // Security: Set various HTTP headers
  app.use(helmet({
    crossOriginResourcePolicy: false
  }))

  // Performance: Compress responses
  app.use(compression())

  // Security: Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes'
  })
  app.use(limiter)


  // Increase payload limit to 100MB for large 3D model uploads
  app.use(express.json({ limit: '100mb' }))
  app.use(express.urlencoded({ limit: '100mb', extended: true }))

  // Serve uploaded files
  app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path, stat) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin')
    }
  }))

  app.use('/v1', APIs_V1)
  //Middlewares xử lý lỗi
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`1.${env.AUTHOR},Chạy thành công ${env.APP_HOST}:${env.APP_PORT}/`)
  })
  exitHook(() => {
    console.log('4.Server is shutting down...')
    CLOSE_DB
    console.log('5.Disconnected from MongoDb cloud Atlas')

  })
}
CONNECT_DB()
  .then(() => console.log('Connected to mongodb Cloud Atlas'))
  .then(() => START_SERVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })

