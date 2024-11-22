'use strict'

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server')

const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
]

const namedMiddleware = {
  auth: 'App/Middleware/Auth'
}

const serverMiddleware = [
  'Adonis/Middleware/Cors'
]

Server
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware)
