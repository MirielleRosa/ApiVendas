'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsuariosSchema extends Schema {
  up () {
    this.create('usuarios', (table) => {
      table.increments()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('usuarios')
  }
}

module.exports = UsuariosSchema
