'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientesSchema extends Schema {
  up () {
    this.create('clientes', (table) => {
      table.increments()
      table.string('nome', 255).notNullable()
      table.string('cpf', 14).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('clientes')
  }
}

module.exports = ClientesSchema
