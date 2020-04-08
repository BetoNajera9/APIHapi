'use strict'

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const Handlebars = require('handlebars')
const Path = require('path')

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

    server.views({
      engines: { // --- hapi puede usar diferentes engines
        hbs: Handlebars // --- asociamos el plugin al tipo de archivos
      },
      relativeTo: __dirname, // --- para que las vistas las busque fuera de /public
      path: 'views', // --- directorio donde colocaremos las vistas dentro de nuestro proyecto
      layout: true, // --- indica que usaremos layouts
      layoutPath: 'views' // --- ubicación de los layouts
    })

    // Definición de rutas (indicar el método HTTP, URL y controlador de ruta)
    server.route({
      method: 'GET',
      path: '/',
      handler: (req, h) => {
        // El objeto h es un conjunto de utilidades para la respuesta.
        return h.view('index', {
          title: 'home'
        })
      }
    })

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          index: ['index.html']
        }
      }
    })

    await server.start()
  } catch (e) {
    console.log(e)

    // Salir de nodeJS con un código de error (1), 0 es un código de exito
    process.exit(1)
  }

  console.log(`Servidor lanzado en ${server.info.uri}`)
}

// Inicializar el proyecto
init()
