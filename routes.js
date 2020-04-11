'use strict'
const Joi = require('@hapi/joi')
const Site = require('./controllers/site')
const User = require('./controllers/user')
const Question = require('./controllers/question')

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
    method: 'GET',
    path: '/login',
    handler: Site.login
  },
  {
    method: 'GET',
    path: '/logout',
    handler: User.logout
  },
  {
    method: 'GET',
    path: '/ask',
    handler: Site.ask
  },
  {
    method: 'POST',
    path: '/create-user',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required().min(10),
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        }),
        failAction: User.failValidation
      }
    },
    handler: User.createUser
  },
  {
    method: 'POST',
    path: '/validate-user',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        }),
        failAction: User.failValidation
      }
    },
    handler: User.validateUser
  },
  {
    method: 'POST',
    path: '/create-question',
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required()
        }),
        failAction: User.failValidation
      }
    },
    handler: Question.createQuestion
  },
  {
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: '.',
        index: ['index.html']
      }
    }
  },
  {
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler: Site.notFound
  }
]
