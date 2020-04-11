'use strict'

// Definición de controladores de ruta

// Importar el archivo de conexión a la base de datos
const Users = require('../models/index').users

/**
 * Controlador encargado de registrar un usuario en la base de datos.
 * La base de datos se encuentra en un servicio desentralizado (Firebase) que retonra una promesa.
 */
async function createUser (req, h) {
  let result
  try {
    result = await Users.create(req.payload)
  } catch (e) {
    console.error(e)
    return h.view('register', {
      titulo: 'Registro',
      error: 'Error creando el usuario'
    })
  }
  return h.view('register', {
    titulo: 'Registro',
    success: 'Usuario creado exitosamente'
  })
}

async function validateUser (req, h) {
  let result
  try {
    result = await Users.validate(req.payload)
    if (!result) {
      return h.view('login', {
        titulo: 'Login',
        error: 'Email y/o contraseña incorrectas'
      })
    }
  } catch (e) {
    console.error(e)
    return h.view('login', {
      titulo: 'Login',
      error: 'Problemas validando el usuario'
    })
  }
  return h.redirect('/').state('user', {
    name: result.name,
    email: result.email
  })
}

async function logout (req, h) {
  return h.redirect('/').unstate('user')
}

// Controlador de errores de validación para los usuarios (amigable)
function failValidation (req, h, err) {
  // Un objeto de las rutas y sus respectivas vistas
  const templates = {
    '/create-user': 'register',
    '/validate-user': 'login',
    '/create-question': 'ask'
  }
  // retorno la vista con base a la ruta donde se originó el error de validación
  // es importante detener la propagación del error en este punto y responder (takeover)
  return h.view(templates[req.path], {
    title: 'Error de validación',
    error: err.output.payload.message
  }).code(400).takeover()
}

module.exports = {
  createUser,
  validateUser,
  logout,
  failValidation
}
