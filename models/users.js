'use-strict'

/**
 * Clase compatible con Firebase Data Base
 */

const Bcrypt = require('bcrypt')

class Users {
  // La clase recibe una referencia hacia la base de datos de firebase donde se guardará la información
  constructor (db) {
    this.db = db
    this.ref = this.db.ref('/')
    this.collection = this.ref.child('users')
  }

  // Método de clase para guardar un usuario en la base de datos de firebase
  async create (data) {
    // Destructuro el objeto con el payload enviado. Ya que Hapi lo decora con un prototipo null que no es compatible con Firebase
    const User = {
      ...data
    }

    // Se genera una contraseña encriptada a partir de la proporcionada. this.constructor llama a la clase, ya que el método encrypt es estático
    User.password = await this.constructor.encrypt(User.password)
    const newUser = this.collection.push(User)
    newUser.set(User)

    // Retornamos el id del usuario
    return newUser.key
  }

  async validate (data) {
    // Ordenar la colección por email, consultar el usuario por su email (no me interesa escuchar cambios en la data, por ello once)
    const userQuery = await this.collection.orderByChild('email').equalTo(data.email).once('value')

    // Obtengo el objeto con los resultados de mi consulta {objId: {}, objId: {}, objId: {}}
    const userFound = userQuery.val()
    if (userFound) {
      // Obtengo un arreglo con los ids de los documentos que forman parte de los resultados de mi busqueda. Me interesa quedarme con el elemento (ObjectId) del primer documento, mas no con el arreglo
      const userId = Object.keys(userFound)[0]
      // comparar si las contraseñas son correctas {documentoResultado.objectId.password}
      const passwdRight = await Bcrypt.compare(data.password, userFound[userId].password)
      const result = (passwdRight) ? userFound[userId] : false

      return result
    }

    return false
  }

  // Método estático asincrono para la encriptacion de contraseñas
  static async encrypt (passwd) {
    const saltRounds = 10
    const hashedPassword = await Bcrypt.hash(passwd, saltRounds)
    return hashedPassword
  }
}

module.exports = Users
