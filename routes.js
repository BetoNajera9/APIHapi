'use strict'
const Joi = require('@hapi/joi')
const Site = require('./controllers/site')
const Users = require('./controllers/users')

module.exports = [
  // Definición de rutas (indicar el método HTTP, URL y controlador de ruta)
  {
    method: 'GET',
    path: '/',
    handler: Site.home
  },
  {
    method: 'GET',
    path: '/register',
    handler: Site.register
  },
  {
    method: 'POST',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required().min(10),
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        })
      }
    },
    path: '/create-user',
    handler: Users.createUser
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        index: ['index.html']
      }
    }
  }
]
