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
    return h.response('Problemas creando usuario').code(500)
  }
  return h.response(`Usuario creado ID: ${result}`).code(201)
}

module.exports = {
  createUser: createUser
}
