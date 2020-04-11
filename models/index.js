'use strict'

// Información de configuración proporcionada en
// NombreProyectoFirebase -> configuración del proyecto -> cuentas del servicio

const Firebase = require('firebase-admin')
const serviceAccount = require('../config/firebase.json')

// Importar modulos (CLASES) correspondientes a los modelos de la base de datos
const Users = require('./users')
const Questions = require('./questions')

Firebase.initializeApp({
  credential: Firebase.credential.cert(serviceAccount),
  databaseURL: 'https://hapidb-a2d42.firebaseio.com/'
})

// Crear una instancia (referencia) de la base de datos
const db = Firebase.database()

// Recordar que los modelos esperan como parámetro una referencia hacia la base de datos.
// Exportamos las instancias de los modelos listas para ser invocadas en los controladores correspondientes
module.exports = {
  users: new Users(db),
  questions: new Questions(db)
}
