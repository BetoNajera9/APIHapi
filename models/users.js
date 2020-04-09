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

  // Método estático asincrono para la encriptacion de contraseñas
  static async encrypt (passwd) {
    const saltRounds = 10
    const hashedPassword = await Bcrypt.hash(passwd, saltRounds)
    return hashedPassword
  }
}

module.exports = Users
