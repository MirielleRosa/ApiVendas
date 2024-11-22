'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnderecosSchema extends Schema {
  up () {
    this.create('enderecos', (table) => {
      table.increments()
      table.integer('cliente_id').unsigned().references('id').inTable('clientes').onDelete('CASCADE')
      table.string('logradouro', 255).notNullable()
      table.string('numero', 10).notNullable()
      table.string('bairro', 255).notNullable()
      table.string('cidade', 255).notNullable()
      table.string('estado', 2).notNullable()
      table.string('cep', 10).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('enderecos')
  }
}


module.exports = EnderecosSchema
