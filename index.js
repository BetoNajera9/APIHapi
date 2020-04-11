'use strict'

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const Handlebars = require('handlebars')
const Path = require('path')
const Routes = require('./routes')
const Site = require('./controllers/site.js')

// Configurar el servidor de nuestra aplicación. En un contenedor (Docker) si marca error colocar 0.0.0.0 (todos)
const server = Hapi.server({
  port: process.env.PORT || 4000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'public')
    }
  }
})

// Definicion de función para inicializar el proyecto. Internamete hay tareas asincronas
async function init () {
  // Arrancar el servidor de HapiJS, se considera una tarea asincrona.
  try {
    await server.register(Inert)
    await server.register(Vision)

    // Configurar el servidor para el envio de cookies (nombreCookie, opciones)
    // https://hapi.dev/tutorials/cookies/?lang=en_US
    // tiempo de vida de la cookie (en milisegundos)
    // localhost no es seguro
    // codificación de la cookie
    server.state('user', {
      // Time to live
      // 1000 = 1 seg, 60= 1min, 60=1hr, 24=1dia, 7=1semana
      ttl: 1000 * 60 * 60 * 24 * 7,
      // Propiedad para saber si es segura
      isSecure: process.env.NODE_ENV === 'prod',
      encoding: 'base64json'
    })

    server.views({
      engines: { // --- hapi puede usar diferentes engines
        hbs: Handlebars // --- asociamos el plugin al tipo de archivos
      },
      relativeTo: __dirname, // --- para que las vistas las busque fuera de /public
      path: 'views', // --- directorio donde colocaremos las vistas dentro de nuestro proyecto
      layout: true, // --- indica que usaremos layouts
      layoutPath: 'views' // --- ubicación de los layouts
    })

    server.ext('onPreResponse', Site.fileNotFound)
    server.route(Routes)

    await server.start()
  } catch (e) {
    console.log(e)

    // Salir de nodeJS con un código de error (1), 0 es un código de exito
    process.exit(1)
  }

  console.log(`Servidor lanzado en ${server.info.uri}`)
}

// Manejadores de errores
process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error.message, error)
})

process.on('unhandledException', error => {
  console.error('unhandledException', error.message, error)
})

// Inicializar el proyecto
init()
